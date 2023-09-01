import { SlashCommandBuilder } from 'discord.js';
import { createRaid } from '../../database/dataRepository/raidRepository';
import { verifyBotChannel } from '../../lib/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_raid')
		.setDescription('create a raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('info')
				.setDescription('info for the raid')
				.setRequired(false)),

	isDevelopment: true,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		const raidName = options.getString('raid_name');
		const raidInfo = options.getString('info');

		try {
			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				await interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const createNewRaid = await createRaid(guildId, raidName, raidInfo);

			if (createNewRaid === null) {
				await interaction.reply({ content: 'There was an issue creating the raid, make sure the raid name does not exist already', ephemeral: true });
				return;
			}

			await interaction.reply({ content: `The raid ${raidName} was created`, ephemeral: true });
		}
		catch (err) {
			console.error('there was an issue running this command');
			interaction.reply('there was an issue running this command, contact support for assistance');
		}
	},
};