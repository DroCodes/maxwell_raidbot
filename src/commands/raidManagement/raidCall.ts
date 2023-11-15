import { SlashCommandBuilder } from 'discord.js';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { findRaid } from '../../database/dataRepository/raidRepository';
import { getRoster } from '../../database/dataRepository/rosterRepository';
import { getMainRoster } from '../../database/dataRepository/mainRosterRepository';
import { getOverflow } from '../../database/dataRepository/overflowRosterRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('raid_call')
		.setDescription('notifies user of raid start')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true)),
	isDevelopment: true,

	async execute(interaction: any) {
		const { guild, guildId, channel, options } = interaction;

		const raidName = options.getString('raid_name');

		const raid = await findRaid(guildId, raidName) as IRaidInstance;

		if (!raid) {
			await interaction.reply({ content: `Raid named ${raidName} does not exist`, ephemeral: true });
			return;
		}

		const roster = await getRoster(<number>raid.id);
		console.log(raid.id);
		if (!roster) {
			await interaction.reply({ content: `Raid named ${raidName} does not have a roster`, ephemeral: true });
			return;
		}
		console.log(<number>roster.id);

		const mainRoster = await getMainRoster(<number>roster.id);

		if (mainRoster === undefined || mainRoster === null) {
			await interaction.reply({ content: `Raid named ${raidName} does not have a main roster`, ephemeral: true });
			return;
		}

		const overFlowRoster = await getOverflow(<number>roster.id);

		let raidCallMessage = '__Main Roster":"__\n';

		const mainRosterMembers = mainRoster.tanks?.concat(<string[]>mainRoster.healers, <string[]>mainRoster.dps);

		mainRosterMembers?.map((member: string) => {
			if (mainRosterMembers?.length === 0) {
				return '';
			}

			const user = guild.members.cache.find((m:any) => m.user.username === member);

			raidCallMessage += `${user}\n`;
		});

		if (overFlowRoster !== undefined && overFlowRoster !== null) {
			if (overFlowRoster.tanks === null) {
				overFlowRoster.tanks = [];
			}

			const overFlowRosterMembers = overFlowRoster.tanks?.concat(<string[]>overFlowRoster.healers, <string[]>overFlowRoster.dps);

			overFlowRosterMembers?.map((member: string) => {
				if (overFlowRosterMembers?.length === 0) {
					return '';
				}

				const user = guild.members.cache.find((m:any) => m.user.username === member);

				raidCallMessage += `${user}\n`;
			});
		}

		raidCallMessage += '\nMessage the raid lead in game for an invite\n';

		const raidChannel = await guild.channels.cache.get(raid.raidChannelId);

		raidChannel.send(raidCallMessage);

		interaction.reply({ content: 'Raid opened', ephemeral: false });
	},
};