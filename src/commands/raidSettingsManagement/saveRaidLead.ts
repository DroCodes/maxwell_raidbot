import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { saveRaidLead } from '../../database/dataRepository/raidSettingsRepository';
import { verifyBotChannel } from '../../services/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save_raid_lead')
		.setDescription('Save the raid lead')
		.addRoleOption(option =>
			option.setName('raid_lead')
				.setDescription('The raid lead')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, options, channel } = interaction;
			const raidLead = options.getRole('raid_lead');

			const verifyChannel = await verifyBotChannel(guildId, channel.id);

			if (!verifyChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const saveLead = await saveRaidLead(guildId, raidLead.id);
			if (!saveLead) {
				interaction.reply({ content: 'issue saving raid lead', ephemeral: true });
				return;
			}

			interaction.reply({ content: `Saved Raid Lead: ${raidLead}`, ephemeral: true });
		}
		catch (err) {
			console.error('there was an issue running the command', err);
			interaction.reply({ content: 'There was an issue running the command', ephemeral: true });
		}
	},
};