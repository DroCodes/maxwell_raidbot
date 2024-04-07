import { SlashCommandBuilder } from 'discord.js';
import { saveAdminChannel } from '../../database/dataRepository/guildSettingsRepository';
import { verifyBotChannel } from '../../lib/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_admin_channel')
		.setDescription('sets the admin channel')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('the channel to set as the admin channel')
				.setRequired(true)),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, channel } = interaction;

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);
			console.log(checkBotChannel);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const channelId = interaction.options.getChannel('channel');

			const saveId = saveAdminChannel(guildId.toString(), channelId.id);

			if (!saveId) {
				interaction.reply({ content: 'unable to save admin channel', ephemeral: true });
				return;
			}

			interaction.reply({ content: `admin channel saved as ${channel.id}`, ephemeral: true });
			console.log(channel.id);
		}
		catch (err) {
			console.error('there was an issue running this command', err);
			interaction.reply({ content: 'there was an issue running this command, contact support for assistance', ephemeral: true });
		}
	},
};