import { SlashCommandBuilder } from 'discord.js';
import { saveRaidChannelGroup } from '../../database/dataRepository/raidSettingsRepository';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_channel_group')
		.setDescription('Adds channel for bot commands')
		.addChannelOption((option: any) =>
			option.setName('raid_channel_group')
				.setDescription('group for raid channels')
				.setRequired(true)),

	isDevelopment: true,

	async execute(interaction: any) {
		try {
			const { guildId, options, channel } = interaction;
			const channelGroup = options.getChannel('raid_channel_group');
			console.log(channelGroup);

			const guild = await findGuildById(guildId);

			if (channel.id != guild?.botChannelId) {
				interaction.reply('This is not the bot channel.');
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

			interaction.reply(`Saved Bot Channel group: ${channelGroup}`);
		}
		catch (err) {
			console.error('there was an issue running the command', err);
		}
	},
};