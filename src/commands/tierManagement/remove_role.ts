import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { removeRoleFromTier } from '../../database/dataRepository/tierRepository';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { verifyBotChannel } from '../../services/verification/channelVerification';

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
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		const checkBotChannel = await verifyBotChannel(guildId, channel.id);

		if (!checkBotChannel) {
			interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
			return;
		}

		const tier = options.getString('tier_name');
		const role = options.getRole('role_name');

		try {
			const removeRole = await removeRoleFromTier(guildId, tier, role.name);

			if (removeRole === null) {
				interaction.reply({ content: 'there was an issue removing the role from tier, please make sure tier exists', ephemeral: true });
				return;
			}
			else if (!removeRole) {
				interaction.reply({ content: `${role} not found in tier`, ephemeral: true });
				return;
			}

			interaction.reply({ content: `${role} has been successfully removed from tier ${tier}`, ephemeral: true });
		}
		catch (err) {
			console.log('There was an error running this command ' + err);
			interaction.reply({ content: 'There was an error running this command', ephemeral: true });
		}
	},
};