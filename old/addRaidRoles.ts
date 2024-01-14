import { SlashCommandBuilder } from 'discord.js';
import { findRaid, saveRaidRoles } from '../../database/dataRepository/raidRepository';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import { verifyRaidExists } from '../../lib/verification/raidVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_raid_roles')
		.setDescription('adds roles to the selected raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('tank')
				.setDescription('number of tanks')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('healer')
				.setDescription('number of healers')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('dps')
				.setDescription('number of dps')
				.setRequired(true)),

	isDevelopment: true,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		try {
			const raidName = options.getString('raid_name');
			const tank = options.getString('tank');
			const healer = options.getString('healer');
			const dps = options.getString('dps');

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

			const roles : string[] = [ tank, healer, dps];

			const saveRoles = await saveRaidRoles(guildId, raidName, roles);

			if (!saveRoles) {
				interaction.reply({ content: 'there was an issue saving the roles', ephemeral: true });
				return;
			}

			interaction.reply({ content: `you have successfully set the roles for ${raidName}: Tank: ${tank}, healer: ${healer} ${dps}`, ephemeral: true });
		}
		catch (err) {
			console.error('there was an issue running this command');
			interaction.reply({ content: `there was an issue running this command ${this.data.name}`, ephemeral: true });
		}
	},
};