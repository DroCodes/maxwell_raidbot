import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { getSettings } from '../../database/dataRepository/guildSettingsRepository';
import { verifyBotChannel } from '../../services/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_settings')
		.setDescription('gets the settings for the guild')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, channel } = interaction;

		try {
			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const settings = await getSettings(guildId);

			if (settings === null || settings === undefined) {
				await interaction.reply({ content: 'there are no settings', ephemeral: true });
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle('Guild settings')
				.addFields({ name: 'Raid channel', value: settings.guildId })
				.addFields({ name: 'Bot channel', value: settings.botChannelId || 'No bot channel set' })
				.addFields({ name: 'Admin Channel', value: settings.adminChannelId || 'No Admin channel set' });

			await interaction.reply({ embeds: [embed] });
		}
		catch (err) {
			console.error('there was an issue running this command', err);
			interaction.reply({ content: 'there was an issue running this command, contact support for assistance', ephemeral: true });
		}
	},
};