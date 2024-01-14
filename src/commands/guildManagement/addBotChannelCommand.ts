import { SlashCommandBuilder } from 'discord.js';
import { saveBotChannelId } from '../../database/dataRepository/guildSettingsRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_bot_channel')
		.setDescription('Adds channel for bot commands')
		.addChannelOption((option) =>
			option.setName('bot_channel')
				.setDescription('channel for bot commands')
				.setRequired(true)),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, options } = interaction;
			const channel = options.getChannel('bot_channel');

			if (!channel.isTextBased()) {
				interaction.reply('please set bot channel to a text channel');
				return;
			}
			const saveChannel = await saveBotChannelId(guildId.toString(), channel.id);
			if (!saveChannel) {
				interaction.reply('issue saving channel');
				return;
			}

			interaction.reply(`Saved Bot Channel: ${channel}`);
		}
		catch (err) {
			console.error('there was an issue running the command', err);
		}
	},
};