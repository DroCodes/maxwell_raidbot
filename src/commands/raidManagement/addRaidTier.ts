import { SlashCommandBuilder } from 'discord.js';
import { findRaid, saveRaidTier } from '../../database/dataRepository/raidRepository';
import { findAllTiers } from '../../database/dataRepository/tierRepository';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import { verifyRaidExists } from '../../lib/verification/raidVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_raid_tier')
		.setDescription('adds raid leader to the selected raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('raid_tier')
				.setDescription('the tier of the raid')
				.setRequired(true)),

	isDevelopment: true,

	async execute(interaction: any) {
		const { guildId, options, channel } = interaction;

		try {
			const raidName = options.getString('raid_name');
			const raidTier = options.getString('raid_tier');

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

			const getTierList = await findAllTiers(guildId);

			if (getTierList === null) {
				interaction.reply({ content: 'there are no saved tiers', ephemeral: true });
				return;
			}

			const doesTierExist = getTierList?.filter(t => {
				return t.tierName === raidTier;
			});

			if (doesTierExist === undefined || doesTierExist.length === 0) {
				interaction.reply({ content: `${raidTier} is not valid, please enter a valid tier`, ephemeral: true });
				return;
			}

			const newTier = await saveRaidTier(guildId, raidName, raidTier);

			if (!newTier) {
				interaction.reply({ content: `there was an issue saving the tier as ${raidTier}, for ${raidName}`, ephemeral: true });
				return;
			}

			interaction.reply({ content: `The raid tier has been set to ${raidTier} for ${raidName}`, ephemeral: true });
		}
		catch (err) {
			console.log(`there was an issue running this command ${this.data.name}`, err);
			interaction.reply({ content: `there was an issue running this command ${this.data.name}`, ephemeral: true });
		}
	},
};