import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { addRoleToTier } from '../../database/dataRepository/tierRepository';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { findRaid } from '../../database/dataRepository/raidRepository';
import { verifyBotChannel } from '../../services/verification/channelVerification';

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
				.setRequired(true))
		.addStringOption((option) =>
			option.setName('raid_role')
				.setDescription('the role associated (Tank, Dps...)')
				.setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),


	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, options, channel } = interaction;

			const tierName = options.getString('tier_name');
			const role = options.getRole('role');
			const raidRole = options.getString('raid_role');

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const addRole = await addRoleToTier(guildId, tierName, role.name, raidRole);

			if (addRole === null) {
				interaction.reply({ content: 'there was an issue adding the role to tier, please make sure tier exists', ephemeral: true });
			}

			interaction.reply({ content: `${raidRole} has been successfully added to tier ${tierName}`, ephemeral: true });
		}
		catch (err) {
			console.log('There was an error running this command ' + err);
			interaction.reply({ content: 'There was an error running this command', ephemeral: true });
		}
	},
};