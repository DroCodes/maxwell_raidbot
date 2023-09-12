import { Events } from 'discord.js';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { findRaid } from '../../database/dataRepository/raidRepository';
import { findTier } from '../../database/dataRepository/tierRepository';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { findRaidSettings, getRaidEmoji } from '../../database/dataRepository/raidSettingsRepository';
import { getEmojiName } from '../../lib/emojiFormat';
import { IRaidSettingsInstance } from '../../interfaces/databaseInterfaces/IRaidSettingsAttributes';
import { IRaidEmojiInstance } from '../../interfaces/databaseInterfaces/IRaidEmojiAttributes';
import {
	addDpsToRoster,
	addHealerToRoster,
	addTankToRoster,
	getMainRoster, removeDpsFromRoster, removeHealerFromRoster, removeTankFromRoster,
} from '../../database/dataRepository/mainRosterRepository';
import { getRoster } from '../../database/dataRepository/rosterRepository';
import { IMainRosterInstance } from '../../interfaces/databaseInterfaces/IMainRosterAttributes';
import { ITierInstance } from '../../interfaces/databaseInterfaces/ITierAttributes';
import {
	addDpsToOverflow, addHealerToOverflow,
	addTankToOverflow,
	getOverflow, removeDpsFromOverflow,
	removeHealerFromOverflow, removeTankFromOverflow,
} from '../../database/dataRepository/overflowRosterRepository';


module.exports = {
	name: Events.MessageReactionAdd,
	once: false,
	isDevelopment: true,

	async execute(reaction: any, user: any) {
		if (user.bot || !reaction.message.guild) return;

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
		let signedUp;
		let isQualified = false;

		console.log(signedUp);

		const member = reaction.message.guild.members.cache.get(user.id);

		if (!member) {
			console.error('Member not found.');
			return;
		}

		// Extract the role names using map
		const userRoleNames = member.roles.cache.map((role:any) => role.name);

		const guild = await findGuildById(guildId);

		if (guild === null) {
			return;
		}

		const raid = await findRaid(guildId, channelName) as IRaidInstance;

		if (raid === null) {
			return;
		}

		if (channelId != raid.raidChannelId) {
			return;
		}

		const roster = await getRoster(<number>raid.id);

		const raidTiers = await findTier(guildId, <string>raid.raidTier) as ITierInstance;

		if (raidTiers === null) {
			return;
		}

		const raidSettings = await findRaidSettings(guildId) as IRaidSettingsInstance;

		if (raidSettings === null) {
			return;
		}

		const raidEmoji = await getRaidEmoji(<number>raidSettings.id) as IRaidEmojiInstance[];

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

		for (let i = 0; i < userRoleNames.length; i++) {
			console.log('test ' + userRoleNames[i]);
			for (let j = 0; j < raidTiers.roleName.length; j++) {
				if (tank) {
					if (userRoleNames[i] === raidTiers.roleName[j] && raidTiers.raidRole[j] === 'tank') {
						isQualified = true;
						break;
					}
				}
				else if (healer) {
					if (userRoleNames[i] === raidTiers.roleName[j] && raidTiers.raidRole[j] === 'healer') {
						isQualified = true;
						break;
					}
				}
				else if (dps) {
					if (userRoleNames[i] === raidTiers.roleName[j] && raidTiers.raidRole[j] === 'dps') {
						isQualified = true;
						break;
					}
				}
			}
		}

		if (!isQualified) {
			console.log('is not qualified');
			return;
		}

		const findMainRoster = await getMainRoster(<number>roster?.id);
		const findOverflowRoster = await getOverflow(<number>roster?.id);

		if (findMainRoster != null) {
			const signedUpAsTank = findMainRoster.tanks?.filter(t => {
				return t === username;
			});

			console.log(signedUpAsTank);

			if (signedUpAsTank != undefined && signedUpAsTank.length != 0) {
				signedUp = { isSignedUp: true, role: 'tank' };
			}

			const signedUpAsHealer = findMainRoster.healers?.filter(h => {
				return h === username;
			});

			if (signedUpAsHealer != undefined && signedUpAsHealer.length != 0) {
				signedUp = { isSignedUp: true, role: 'healer' };
			}

			console.log(signedUpAsHealer);

			const signedUpAsDps = findMainRoster.dps?.filter(d => {
				return d === username;
			});

			if (signedUpAsDps != undefined && signedUpAsDps.length != 0) {
				signedUp = { isSignedUp: true, role: 'dps' };
			}
		}

		const checkOverflowTank = findOverflowRoster?.tanks?.indexOf(username);
		const checkOverflowHealer = findOverflowRoster?.healers?.indexOf(username);
		const checkOverflowDps = findOverflowRoster?.dps?.indexOf(username);

		if (tank) {
			if (signedUp?.isSignedUp === true && signedUp.role === 'tank') {
				console.log('is already signed up as tank');
				return;
			}

			if (signedUp?.isSignedUp === true && signedUp.role != 'tank') {
				await removeHealerFromRoster(<number>roster?.id, username);
				await removeDpsFromRoster(<number>roster?.id, username);

				signedUp = { isSignedUp: null, role: null };
			}
			if (findMainRoster === null) {
				await addTankToRoster(<number>roster?.id, username, 'tank');
				console.log('main roster null added tank');
			}
			else if (<number>findMainRoster?.tanks?.length != Number(raid.tanks)) {
				await addTankToRoster(<number>roster?.id, username, 'tank');
				console.log('added tank');
			}
			else {
				console.log(checkOverflowTank);
				if (findOverflowRoster === null || checkOverflowTank === -1) {
					console.log('added to overflow');
					console.log(checkOverflowTank);
					await addTankToOverflow(<number>roster?.id, username, 'tank');
				}

				if (checkOverflowHealer != -1 || checkOverflowDps != -1) {
					await removeHealerFromOverflow(<number>roster?.id, username);
					await removeDpsFromOverflow(<number>roster?.id, username);
				}
			}
		}
		else if (healer) {
			if (signedUp?.isSignedUp === true && signedUp.role === 'healer') {
				console.log('healer if' + ' ' + signedUp?.role);
				console.log('is already signed up as healer');
				return;
			}

			if (signedUp?.isSignedUp === true && signedUp.role != 'healer') {
				await removeTankFromRoster(<number>roster?.id, username);
				await removeDpsFromRoster(<number>roster?.id, username);

				signedUp = { isSignedUp: null, role: null };
			}

			if (findMainRoster === null) {
				await addHealerToRoster(<number>roster?.id, username, 'healer');
				console.log('main roster null added healer');
			}
			else if (<number>findMainRoster?.healers?.length != Number(raid.healers)) {
				await addHealerToRoster(<number>roster?.id, username, 'healer');
				console.log('added healer');
			}
			else {
				console.log(checkOverflowHealer);
				if (findOverflowRoster === null || checkOverflowHealer === -1) {
					console.log('added to overflow');
					console.log(checkOverflowTank);
					await addHealerToOverflow(<number>roster?.id, username, 'healer');
				}

				if (checkOverflowTank != -1 || checkOverflowDps != -1) {
					await removeTankFromOverflow(<number>roster?.id, username);
					await removeDpsFromOverflow(<number>roster?.id, username);
				}
			}
		}
		else if (dps) {
			if (signedUp?.isSignedUp === true && signedUp.role === 'dps') {
				console.log('dps if' + ' ' + signedUp?.role);
				console.log('is already signed up as dps');
				return;
			}

			if (signedUp?.isSignedUp === true && signedUp.role != 'dps') {
				await removeTankFromRoster(<number>roster?.id, username);
				await removeHealerFromRoster(<number>roster?.id, username);

				signedUp = { isSignedUp: null, role: null };
			}

			if (findMainRoster === null) {
				await addDpsToRoster(<number>roster?.id, username, 'dps');
				console.log('main roster null added dps');
			}
			else if (<number>findMainRoster?.dps?.length != Number(raid.dps)) {
				await addDpsToRoster(<number>roster?.id, username, 'dps');
				console.log('added dps');
			}
			else {
				console.log(checkOverflowDps);
				if (findOverflowRoster === null || checkOverflowDps === -1) {
					console.log('added to overflow');
					console.log(checkOverflowTank);
					await addDpsToOverflow(<number>roster?.id, username, 'dps');
				}

				if (checkOverflowTank != -1 || checkOverflowHealer != -1) {
					await removeTankFromOverflow(<number>roster?.id, username);
					await removeHealerFromOverflow(<number>roster?.id, username);
				}
			}
		}

		console.log(signedUp?.role);
		signedUp = { isSignedUp: null, role: null };
		console.log(signedUp);
		console.log('end of method');
		return;
		/*
		* TODO
		*  Edit the embed
		* */
	},
};