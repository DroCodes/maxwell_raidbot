import { SlashCommandBuilder } from 'discord.js';
import { createTier } from '../../database/dataRepository/tierRepository';
import { verifyBotChannel } from '../../lib/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_tier')
		.setDescription('creates a new tier')
		.addStringOption((option) =>
			option.setName('tier_name')
				.setDescription('tier name')
				.setRequired(true),
		)
		.addRoleOption((option) =>
			option.setName('role')
				.setDescription('role to add')
				.setRequired(true))
		.addStringOption((option) =>
			option.setName('raid_role')
				.setDescription('the role associated (Tank, Dps...)')
				.setRequired(true),
		)
		.addBooleanOption((option) =>
			option.setName('is_restricted')
				.setDescription('is this tier restricted by roles')
				.setRequired(false)),

	isDevelopment: false,

	async execute(interaction: any) {
		console.log('Interaction type' + typeof interaction);
		try {
			const { guildId, options, channel } = interaction;

			const tierName = options.getString('tier_name');
			const role = options.getRole('role');
			const raidRole = options.getString('raid_role');
			const isRestricted = options.getBoolean('is_restricted');

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const formatTierName = tierName.replace(' ', '-');

			const saveTier = await createTier(guildId, formatTierName, role.name, raidRole, isRestricted);

			if (!saveTier) {
				interaction.reply(`There was an issue saving the tier, please make a tier doesn't already exist with the name ${tierName}.`);
				return;
			}

			interaction.reply(`Tier ${tierName} has been saved`);
		}
		catch (err) {
			console.log('There was an error running this command ' + err);
			interaction.reply('There was an error running this command');
		}
	},
};