import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { saveRaidChannelGroup } from '../../database/dataRepository/raidSettingsRepository';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { verifyBotChannel } from '../../services/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_channel_group')
		.setDescription('Adds channel for bot commands')
		.addChannelOption((option: any) =>
			option.setName('raid_channel_group')
				.setDescription('group for raid channels')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, options, channel } = interaction;
			const channelGroup = options.getChannel('raid_channel_group');

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			if (channelGroup.type === 'TEXT') {
				interaction.reply('please set raid channel group to a channel category');
				return;
			}

			const saveChannelGroup = await saveRaidChannelGroup(guildId.toString(), channelGroup.id);
			if (!saveChannelGroup) {
				interaction.reply('issue saving channel group');
				return;
			}

			interaction.reply({ content: `Saved Bot Channel group: ${channelGroup}`, ephemeral: true });
		}
		catch (err) {
			console.error('there was an issue running the command', err);
		}
	},
};