import { SlashCommandBuilder } from 'discord.js';
import { deleteTier } from '../../database/dataRepository/tierRepository';
import tier from '../../database/models/tier';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_tier')
		.setDescription('Deletes the specified tier')
		.addStringOption(option =>
			option.setName('tier_name')
				.setDescription('The name of the tier to delete')
				.setRequired(true)),
	isDevelopment: true,

	async execute(interaction: any) {
		const { guildId, options } = interaction;

		const tierName = options.getString('tier_name');
		console.log('tier name: ' + tierName);

		const removeTier = await deleteTier(guildId, tierName);

		if (!removeTier) {
			interaction.reply('there was an issue deleting the tier');
			return;
		}

		interaction.reply('Tier deleted successfully');
	},
};