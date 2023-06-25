import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { findAllTiers } from '../../database/dataRepository/tierRepository';
import tier from '../../database/models/tier';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_tiers')
		.setDescription('gets a list of all tiers'),

	isDevelopment: true,

	async execute(interaction: any) {
		try {
			const { guildId } = interaction;

			const getAllTiers = await findAllTiers(guildId);


			if (getAllTiers === null || getAllTiers === undefined) {
				interaction.reply('there was a problem retrieving the tiers');
				return;
			}

			const embedArr : EmbedBuilder[] = [];
			let embed: EmbedBuilder;

			for (let i = 0; i < getAllTiers.length; i++) {
				embed = new EmbedBuilder()
					.setTitle(getAllTiers[i].tierName);

				getAllTiers[i].roleName.forEach(r => {
					embed.addFields({ name: 'role:', value: r });
				});

				embedArr.push(embed);
			}

			await interaction.reply({ embeds: embedArr });
		}
		catch (err) {
			console.log('There was an error running this command ' + err);
			interaction.reply('There was an error running this command');
		}
	},
};