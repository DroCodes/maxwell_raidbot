import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import { findAllRaids } from '../../database/dataRepository/raidRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_raids')
		.setDescription('gets a list of all raids')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		try {
			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const raids = await findAllRaids(guildId);

			if (raids === null || raids === undefined) {
				await interaction.reply({ content: 'there are no raids', ephemeral: true });
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle('Active raids');

			for (let i = 0; i < raids?.length; i++) {
				embed.addFields({ name: raids[i].raidName, value: ' ' });
			}

			await interaction.reply({ embeds: [embed] });
		}
		catch (err) {
			console.error('there was an issue running this command', err);
			interaction.reply('there was an issue running this command, contact support for assistance');
		}
	},
};