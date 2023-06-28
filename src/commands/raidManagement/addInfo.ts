import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_info')
		.setDescription('add the info for the raid'),

	isDevelopment: true,

	async execute(interaction: any) {
		console.log('Info command');
	},
};