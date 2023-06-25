import { SlashCommandBuilder } from 'discord.js';
import { removeRoleFromTier } from '../../database/dataRepository/tierRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_role')
		.setDescription('removes role from tier')
		.addStringOption(option =>
			option.setName('tier_name')
				.setDescription('tier to remove role')
				.setRequired(true),
		)
		.addRoleOption(option =>
			option.setName('role_name')
				.setDescription('role to remove from tier')
				.setRequired(true),
		),

	isDevelopment: true,

	async execute(interaction: any) {
		const { guildId, options } = interaction;

		const tier = options.getString('tier_name');
		const role = options.getRole('role_name');

		const removeRole = await removeRoleFromTier(guildId, tier, role.name);

		if (removeRole === null) {
			interaction.reply('there was an issue removing this role');
			return;
		}
		else if (!removeRole) {
			interaction.reply(`cannot find role "${role.name}", make sure you are selecting the correct role`);
			return;
		}

		interaction.reply(`${role} succesfully removed from ${tier}`);
	},
};