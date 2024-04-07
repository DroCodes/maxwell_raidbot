import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import { verifyRaidExists } from '../../lib/verification/raidVerification';
import { parseDate } from '../../lib/dateHelpers/dateFormater';
import { deleteRaid, saveRaidDate } from '../../database/dataRepository/raidRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_raid')
		.setDescription('deletes raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		try {
			const raidName = options.getString('raid_name');

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const checkRaidExists = await verifyRaidExists(guildId, raidName);

			if (!checkRaidExists) {
				interaction.reply({ content: `Raid named ${raidName} does not exist`, ephemeral: true });
				return;
			}

			const removeRaid = deleteRaid(guildId, raidName);

			if (!removeRaid) {
				interaction.reply({ content: `unable to delete ${raidName}`, ephemeral: true });
				return;
			}

			interaction.reply({ content: `${raidName} has been deleted`, ephemeral: true });
		}
		catch (err) {
			console.error('there was an issue running this command');
			interaction.reply({ content: 'there was an issue running this command', ephemeral: true });
		}
	},
};