import { SlashCommandBuilder } from 'discord.js';
import { createTier } from '../../database/dataRepository/tierRepository';

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
		.addBooleanOption((option) =>
			option.setName('is_restricted')
				.setDescription('is this tier restricted by roles')
				.setRequired(false)),

	isDevelopment: true,

	async execute(interaction: any) {
		console.log('Interaction type' + typeof interaction);
		try {
			const { guildId, options } = interaction;

			const tierName = options.getString('tier_name');
			const role = options.getRole('role');
			const isRestricted = options.getBoolean('is_restricted');

			const formatTierName = tierName.replace(' ', '-');

			const saveTier = await createTier(guildId, formatTierName, role.name, isRestricted);

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