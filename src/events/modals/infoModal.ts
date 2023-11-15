import { ActionRowBuilder, Events, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import { findRaid } from '../../database/dataRepository/raidRepository';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';

module.exports = {
	name: Events.InteractionCreate,

	async execute(interaction: any) {
		if (!interaction.isChatInputCommand()) return;

		if (interaction.commandName === 'add_info') {
			const { guildId, channel } = interaction;

			const botChannel = await verifyBotChannel(guildId, channel.id);

			if (!botChannel) {
				interaction.reply('this is not the bot channel');
				return;
			}

			const modal = new ModalBuilder()
				.setCustomId('info')
				.setTitle('Raid Info');

			const raidName = new TextInputBuilder()
				.setCustomId('raidName')
				.setLabel('Raid name')
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const raidInfo = new TextInputBuilder()
				.setCustomId('raidInfo')
				.setLabel('Raid Info')
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true);

			const raidNameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(raidName);
			const raidInfoActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(raidInfo);

			modal.addComponents(raidNameActionRow, raidInfoActionRow);

			await interaction.showModal(modal);
		}
	},
};