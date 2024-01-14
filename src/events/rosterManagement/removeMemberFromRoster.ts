import { EmbedBuilder, Events } from 'discord.js';
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
import { editRosterMessage } from '../../lib/messageHelpers/editRaidMessage';

module.exports = {
	name: Events.MessageReactionRemove,
	once: false,
	isDevelopment: false,

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

		let overflowRoster = await getOverflow(<number>roster.id);

		if (overflowRoster === null) {
			console.log('overflow roster does not exist ' + raid.raidName);
		}

		const raidEmoji = await getRaidEmoji(<number>raidSettings?.id) as IRaidEmojiInstance[];

		if (raidEmoji === null) {
			return;
		}

		for (let i = 0; i < raidEmoji.length; i++) {
			const formatEmoji = getEmojiName(raidEmoji[i].emoji);

			if (reactionEmoji === formatEmoji) {
				if (raidEmoji[i].role.toLowerCase() === 'tank') {
					tank = true;
				}
				else if (raidEmoji[i].role.toLowerCase() === 'healer') {
					healer = true;
				}
				else if (raidEmoji[i].role.toLowerCase() === 'dps') {
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

			if (isRemoved && overflowRoster?.healers != null) {
				await addTankToRoster(<number>roster?.id, overflowRoster.healers[0], 'tank');
				await removeTankFromOverflow(<number>roster.id, overflowRoster.healers[0]);
				console.log(`Moved ${overflowRoster.healers[0]} from overflow to main roster as healer`);
			}
		}
		else if (dps) {
			if (mainRoster?.dps?.indexOf(username) != -1) {
				console.log(`removed ${username} from dps role in main roster`);
				await removeDpsFromRoster(<number>roster.id, username);
				isRemoved = true;
			}
			else if (overflowRoster?.dps != null && overflowRoster?.dps?.indexOf(username) != -1) {
				console.log(`removed ${username} from dps role in overflow roster`);
				await removeDpsFromOverflow(<number>roster.id, username);
			}

			if (isRemoved && overflowRoster?.dps != null) {
				await addTankToRoster(<number>roster?.id, overflowRoster.dps[0], 'tank');
				await removeTankFromOverflow(<number>roster.id, overflowRoster.dps[0]);
				console.log(`Moved ${overflowRoster.dps[0]} from overflow to main roster as dps`);
			}
		}

		try {
			const getRosterRoles = await getMainRoster(<number>roster?.id);
			overflowRoster = await getOverflow(<number>roster?.id);

			const tankNames = getRosterRoles?.tanks || [];
			const healerNames = getRosterRoles?.healers || [];
			const dpsNames = getRosterRoles?.dps || [];

			const tankList = tankNames.join('\n');
			const healerList = healerNames.join('\n');
			const dpsList = dpsNames.join('\n');

			const masterList = tankList + '\n' + healerList + '\n' + dpsList;

			const overFlowTanks = overflowRoster?.tanks || [];
			const overFlowHealers = overflowRoster?.healers || [];
			const overFlowDps = overflowRoster?.dps || [];

			const overFlowTankList = overFlowTanks.join('\n');
			const overFlowHealerList = overFlowHealers.join('\n');
			const overFlowDpsList = overFlowDps.join('\n');

			const overFlowList = overFlowTankList + '\n' + overFlowHealerList + '\n' + overFlowDpsList;

			const raidSize = Number(raid.tanks) + Number(raid.healers) + Number(raid.dps);

			const overflowRosterCount = overFlowTanks.length + overFlowHealers.length + overFlowDps.length;

			const rosterCount = tankNames.length + healerNames.length + dpsNames.length + '/' + raidSize + '( +' + overflowRosterCount + ')' + ' total signups';

			const targetMessage = await reaction.message.channel.messages.fetch(raid.rosterMsgId);

			const rosterEmbed = editRosterMessage(masterList, overFlowList, [tankNames.length, healerNames.length, dpsNames.length], rosterCount.toString(), '');

			await targetMessage.edit({ embeds: [rosterEmbed] });

		}
		catch (err) {
			console.error('Error:', err);
		}
	},
};