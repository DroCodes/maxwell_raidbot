import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { findAllTiers } from '../../database/dataRepository/tierRepository';
import tier from '../../database/models/tier';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { verifyBotChannel } from '../../services/verification/channelVerification';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_tiers')
		.setDescription('gets a list of all tiers')
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
			interaction.reply({ content: 'There was an error running this command', ephemeral: true });
		}
	},
};