import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_all_settings')
		.setDescription('add all raid settings at once')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
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