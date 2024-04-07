import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_info')
		.setDescription('add the info for the raid')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			console.log('...');
		}
		catch (err) {
			console.error('there was an issue running the command', err);
			interaction.reply({ content: 'there was an issue running the command, contact support for assistance', ephemeral: true });
		}
	},
};