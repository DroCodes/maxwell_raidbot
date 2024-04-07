import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { findRaid } from '../../database/dataRepository/raidRepository';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import { convertToUnixTime } from '../../lib/dateHelpers/dateFormater';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_raid_info')
		.setDescription('gets the info for a raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		const raidName = options.getString('raid_name').toLowerCase();

		try {
			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const raid = await findRaid(guildId, raidName) as IRaidInstance;

			if (raid === null || raid === undefined) {
				await interaction.reply({ content: 'there is no raid with that name', ephemeral: true });
				return;
			}

			let time: string | Date = 'No date set';

			if (raid.raidDateTime != null || raid.raidDateTime != undefined) {
				time = convertToUnixTime(raid.raidDateTime).toString();
			}

			const embed = new EmbedBuilder()
				.setTitle(raid.raidName)
				.addFields(
					{ name: 'Raid Name', value: raid.raidName },
					{ name: 'Raid Date', value: `<t:${time}>` },
					{ name: 'Raid Lead', value: raid.raidLead as string ?? 'No Raid Lead Set' },
					{ name: 'Raid Tier', value: raid.raidTier as string ?? 'No Tier Set' },
					{ name: 'Tanks:', value: raid.tanks as string ?? 'No Tanks set' },
					{ name: 'Healers:', value: raid.healers as string ?? 'No Healers Set' },
					{ name: 'DPS:', value: raid.dps as string ?? 'No DPS Set' },
				);

			await interaction.reply({ embeds: [embed] });
		}
		catch (err) {
			console.error('there was an issue running this command', err);
			interaction.reply('there was an issue running this command, contact support for assistance');
		}
	},
};