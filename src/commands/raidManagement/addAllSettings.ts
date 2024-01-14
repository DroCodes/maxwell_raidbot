import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_all_settings')
		.setDescription('add all raid settings at once')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true)),

	isDevelopment: false,

	async execute(interaction: any) {
		console.log('...');
	},
};