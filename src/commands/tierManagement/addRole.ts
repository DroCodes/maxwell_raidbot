import { SlashCommandBuilder } from 'discord.js';
import { addRoleToTier } from '../../database/dataRepository/tierRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_role')
		.setDescription('Adds role to tier')
		.addStringOption((option) =>
			option.setName('tier_name')
				.setDescription('tier name')
				.setRequired(true),
		)
		.addRoleOption((option) =>
			option.setName('role')
				.setDescription('role to add')
				.setRequired(true)),

	isDevelopment: true,

	async execute(interaction: any) {
		try {
			const { guildId, options } = interaction;

			const tierName = options.getString('tier_name');
			const role = options.getRole('role');

			const addRole = await addRoleToTier(guildId, tierName, role.name);

			if (addRole === null) {
				interaction.reply('there was an issue adding the role to tier, please make sure tier exists');
			}

			interaction.reply('Role has been successfully added');
		}
		catch (err) {
			console.log('There was an error running this command ' + err);
			interaction.reply('There was an error running this command');
		}
	},
};