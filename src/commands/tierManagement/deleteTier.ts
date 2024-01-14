import { SlashCommandBuilder } from 'discord.js';
import { deleteTier } from '../../database/dataRepository/tierRepository';
import tier from '../../database/models/tier';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { verifyBotChannel } from '../../lib/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_tier')
		.setDescription('Deletes the specified tier')
		.addStringOption(option =>
			option.setName('tier_name')
				.setDescription('The name of the tier to delete')
				.setRequired(true)),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		const tierName = options.getString('tier_name');

		const checkBotChannel = await verifyBotChannel(guildId, channel.id);

		if (!checkBotChannel) {
			interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
			return;
		}

		const removeTier = await deleteTier(guildId, tierName);

		if (!removeTier) {
			interaction.reply('there was an issue deleting the tier');
			return;
		}

		interaction.reply('Tier deleted successfully');
	},
};