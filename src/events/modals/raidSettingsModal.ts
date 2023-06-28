import {
	ActionRowBuilder,
	Events,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import { verifyRaidExists } from '../../lib/verification/raidVerification';

module.exports = {
	name: Events.InteractionCreate,

	async execute(interaction: any) {
		if (!interaction.isChatInputCommand()) return;

		const { guildId, channel, options } = interaction;

		const botChannel = await verifyBotChannel(guildId, channel.id);

		if (!botChannel) {
			interaction.reply('this is not the bot channel');
			return;
		}

		const raidNameInput = options.getString('raid_name');

		const findRaid = await verifyRaidExists(guildId, raidNameInput);

		if (!findRaid) {
			interaction.reply({ content: `${raidNameInput} does not exist`, ephemeral: true });
			return;
		}

		if (interaction.commandName === 'add_all_settings') {
			const modal = new ModalBuilder()
				.setCustomId('allSettings')
				.setTitle('Fill out all fields below');

			const raidName = new TextInputBuilder()
				.setCustomId('raidName')
				.setLabel('Raid Name')
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const raidLead = new TextInputBuilder()
				.setCustomId('raidLead')
				.setLabel('Raid Leader')
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const raidDate = new TextInputBuilder()
				.setCustomId('date')
				.setLabel('Raid Date (mm-dd hh:mm)')
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const raidTier = new TextInputBuilder()
				.setCustomId('tier')
				.setLabel('Raid Tier')
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const raidRoles = new TextInputBuilder()
				.setCustomId('roles')
				.setLabel('Raid roles (Tanks, Healers, and DPS)')
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			const raidNameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(raidName);
			const raidLeadActionRole = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(raidLead);
			const raidDateActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(raidDate);
			const raidTierActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(raidTier);
			const raidRolesActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(raidRoles);


			modal.addComponents(raidNameActionRow, raidLeadActionRole, raidDateActionRow, raidTierActionRow, raidRolesActionRow);

			await interaction.showModal(modal);
		}
	},
};