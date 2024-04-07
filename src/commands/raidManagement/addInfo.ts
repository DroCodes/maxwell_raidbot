import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { verifyBotChannel } from '../../services/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_info')
		.setDescription('add the info for the raid')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, channel } = interaction;

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}
			console.log('...');
		}
		catch (err) {
			console.error('there was an issue running the command', err);
			interaction.reply({ content: 'there was an issue running the command, contact support for assistance', ephemeral: true });
		}
	},
};