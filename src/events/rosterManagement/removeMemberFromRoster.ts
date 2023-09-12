import { Events } from 'discord.js';
import { findRaid } from '../../database/dataRepository/raidRepository';
import { findRaidSettings, getRaidEmoji } from '../../database/dataRepository/raidSettingsRepository';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { getRoster } from '../../database/dataRepository/rosterRepository';
import {
	addTankToRoster,
	getMainRoster,
	removeDpsFromRoster, removeHealerFromRoster,
	removeTankFromRoster,
} from '../../database/dataRepository/mainRosterRepository';
import {
	addTankToOverflow,
	getOverflow, removeDpsFromOverflow,
	removeHealerFromOverflow,
	removeTankFromOverflow,
} from '../../database/dataRepository/overflowRosterRepository';
import { getEmojiName } from '../../lib/emojiFormat';
import { IRaidEmojiInstance } from '../../interfaces/databaseInterfaces/IRaidEmojiAttributes';

module.exports = {
	name: Events.MessageReactionRemove,
	once: false,
	isDevelopment: true,

	async execute(reaction: any, user: any) {
		if (user.bot || !reaction.message.guild) return;
		console.log('test');

		if (reaction.partial) {
			// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
			try {
				await reaction.fetch();
			}
			catch (error) {
				console.error('Something went wrong when fetching the message:', error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}

		const guildId = reaction.message.guild.id;
		const channelName = reaction.message.channel.name;
		const channelId = reaction.message.channel.id;
		const username = user.username;
		const reactionEmoji = reaction.emoji.name;
		let tank;
		let healer;
		let dps;
		const raidSettings = await findRaidSettings(guildId);

		if (raidSettings === null) {
			return;
		}

		const raid = await findRaid(guildId, channelName) as IRaidInstance;

		if (raid === null) return;

		if (raid.raidChannelId != channelId) return;

		const roster = await getRoster(<number>raid.id);

		if (roster === null) {
			console.log('roster is null for ' + raid.raidName);
			return;
		}

		const mainRoster = await getMainRoster(<number>roster.id);

		if (mainRoster === null) {
			console.log('main roster does not exist ' + raid.raidName);
			return;
		}

		const overflowRoster = await getOverflow(<number>roster.id);

		if (overflowRoster === null) {
			console.log('overflow roster does not exist ' + raid.raidName);
		}


		/* TODO
		* check user reaction removed to make sure they are signed up as that role.
		* */

		const raidEmoji = await getRaidEmoji(<number>raidSettings?.id) as IRaidEmojiInstance[];

		if (raidEmoji === null) {
			return;
		}

		for (let i = 0; i < raidEmoji.length; i++) {
			const formatEmoji = getEmojiName(raidEmoji[i].emoji);

			if (reactionEmoji === formatEmoji) {
				if (raidEmoji[i].role.toLowerCase() === 'tank') {
					console.log('tank is true');
					tank = true;
				}
				else if (raidEmoji[i].role.toLowerCase() === 'healer') {
					console.log('healer is true');
					healer = true;
				}
				else if (raidEmoji[i].role.toLowerCase() === 'dps') {
					console.log('dps is true');
					dps = true;
				}
			}
		}

		let isRemoved = false;

		// removes from main roster
		if (tank) {
			if (mainRoster?.tanks?.indexOf(username) != -1) {
				console.log(`removed ${username} from tank role in main roster`);
				await removeTankFromRoster(<number>roster.id, username);
				isRemoved = true;
			}
			else if (overflowRoster?.tanks != null && overflowRoster?.tanks?.indexOf(username) != -1) {
				console.log(`removed ${username} from tank role in overflow roster`);
				await removeTankFromOverflow(<number>roster.id, username);
			}

			if (isRemoved && overflowRoster?.tanks != null) {
				await addTankToRoster(<number>roster?.id, overflowRoster.tanks[0], 'tank');
				await removeTankFromOverflow(<number>roster.id, overflowRoster.tanks[0]);
				console.log(`Moved ${overflowRoster.tanks[0]} from overflow to main roster as tank`);
			}
		}
		else if (healer) {
			if (mainRoster?.healers?.indexOf(username) != -1) {
				console.log(`removed ${username} from healer role in main roster`);
				await removeHealerFromRoster(<number>roster.id, username);
				isRemoved = true;
			}
			else if (overflowRoster?.healers != null && overflowRoster?.healers?.indexOf(username) != -1) {
				console.log(`removed ${username} from healer role in overflow roster`);
				await removeHealerFromOverflow(<number>roster.id, username);
			}

			if (isRemoved && overflowRoster?.tanks != null) {
				await addTankToRoster(<number>roster?.id, overflowRoster.tanks[0], 'tank');
				await removeTankFromOverflow(<number>roster.id, overflowRoster.tanks[0]);
				console.log(`Moved ${overflowRoster.tanks[0]} from overflow to main roster as tank`);
			}
		}
		else if (dps) {
			if (overflowRoster?.tanks != null && mainRoster?.dps?.indexOf(username) != -1) {
				console.log(`removed ${username} from dps role in main roster`);
				await removeDpsFromRoster(<number>roster.id, username);
				isRemoved = true;
			}
			else if (overflowRoster?.dps != null && overflowRoster?.dps?.indexOf(username) != -1) {
				console.log(`removed ${username} from dps role in overflow roster`);
				await removeDpsFromOverflow(<number>roster.id, username);
			}

			if (isRemoved && overflowRoster?.tanks != null) {
				await addTankToRoster(<number>roster?.id, overflowRoster.tanks[0], 'tank');
				await removeTankFromOverflow(<number>roster.id, overflowRoster.tanks[0]);
				console.log(`Moved ${overflowRoster.tanks[0]} from overflow to main roster as tank`);
			}
		}

		console.log('end of method');
	},
};