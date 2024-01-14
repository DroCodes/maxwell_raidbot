import { SlashCommandBuilder } from 'discord.js';
import { findAllRaids, findRaid } from '../../database/dataRepository/raidRepository';
import { getMainRoster } from '../../database/dataRepository/mainRosterRepository';
import { getOverflow } from '../../database/dataRepository/overflowRosterRepository';
import { editRosterMessage } from '../../lib/messageHelpers/editRaidMessage';
import { getRoster } from '../../database/dataRepository/rosterRepository';

// will need to come back to this. need to rework the way the message is built and edited

module.exports = {
	data: new SlashCommandBuilder()
		.setName('message')
		.setDescription('add message to raid message')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('message to add')
				.setRequired(true)),
	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, channelId, options } = interaction;
		const message = options.getString('message');

		const allRaids = await findAllRaids(guildId);

		if (allRaids === null || allRaids === undefined) {
			return;
		}

		const threadIds = allRaids.map((raid) => raid.threadChannelId);

		if (threadIds.indexOf(channelId) === -1) {
			interaction.reply({ content: 'this is not a raid thread', ephemeral: true });
			return;
		}

		try {
			const raid = allRaids.find((r) => r.threadChannelId === channelId);
			const roster = await getRoster(<number>raid?.id);
			const mainRoster = await getMainRoster(<number>roster?.id);
			const overflowRoster = await getOverflow(<number>roster?.id);

			console.log(raid?.id);

			const tankNames = mainRoster?.tanks || [];
			const healerNames = mainRoster?.healers || [];
			const dpsNames = mainRoster?.dps || [];

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

			const raidSize = Number(raid?.tanks) + Number(raid?.healers) + Number(raid?.dps);

			const overflowRosterCount = overFlowTanks.length + overFlowHealers.length + overFlowDps.length;

			const rosterCount = tankNames.length + healerNames.length + dpsNames.length + '/' + raidSize + '( +' + overflowRosterCount + ')' + ' total signups';

			const targetMessage = await interaction.channel.parent.messages.fetch(raid?.rosterMsgId);

			console.log(targetMessage.id);

			const rosterEmbed = editRosterMessage(masterList, overFlowList, [tankNames.length, healerNames.length, dpsNames.length], rosterCount.toString(), message);

			await targetMessage.edit({ embeds: [rosterEmbed] });
		}
		catch (err) {
			console.error('Error:', err);
		}

		interaction.reply({ content: 'message added', ephemeral: true });
	},
};