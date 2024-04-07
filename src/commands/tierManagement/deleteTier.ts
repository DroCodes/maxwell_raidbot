import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
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
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, options, channel } = interaction;

			const tierName = options.getString('tier_name');

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const removeTier = await deleteTier(guildId, tierName);

			if (!removeTier) {
				interaction.reply({ content: `There was an issue deleting the tier, please make sure the tier ${tierName} exists.`, ephemeral: true });
				return;
			}

			interaction.reply({ content: `Tier ${tierName} has been deleted`, ephemeral: true });
		}
		catch (err) {
			console.log('There was an error running this command ' + err);
			interaction.reply({ content: 'There was an error running this command', ephemeral: true });
		}
	},
};