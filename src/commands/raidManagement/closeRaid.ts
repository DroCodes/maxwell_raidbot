import { SlashCommandBuilder } from 'discord.js';
import { deleteRaid, findRaid } from '../../database/dataRepository/raidRepository';
import { deleteMainRoster } from '../../database/dataRepository/mainRosterRepository';
import { getRoster } from '../../database/dataRepository/rosterRepository';
import { deleteOverflow } from '../../database/dataRepository/overflowRosterRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close_raid')
		.setDescription('Closes Specified Raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('Raid to be closed')
				.setRequired(true)),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, guild, options } = interaction;

		const raidName = options.getString('raid_name');

		const raid = await findRaid(guildId, raidName);

		if (raid === null) {
			interaction.reply({ content: 'Could not close raid, please make sure the raid specified is correct', ephemeral: true });
			return;
		}

		const roster = await getRoster(<number>raid?.id);

		const delRaid = await deleteRaid(guildId, raidName);

		const raidChannel = await guild.channels.fetch(raid?.raidChannelId);

		if (!delRaid) {
			interaction.reply({ content: 'Could not close raid, please make sure the raid specified is correct', ephemeral: true });
			return;
		}
		else {
			await deleteMainRoster(<number>roster?.id);
			await deleteOverflow(<number>roster?.id);
		}

		await guild.channels.delete(raidChannel);
		await interaction.reply({ content: `${raidName} successfully closed and the channel has been deleted`, ephemeral: true });
	},
};