import { SlashCommandBuilder } from 'discord.js';
import { saveGuildId } from '../../database/dataRepository/guildSettingsRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_guild_id')
		.setDescription('sets the guild id'),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guildId } = interaction;

		const saveId = saveGuildId(guildId.toString());

		if (!saveId) {
			interaction.reply({ content: 'unable to save guild id', ephemeral: true });
			return;
		}

		interaction.reply({ content: `guild id saved as ${guildId}`, ephemeral: true });
		console.log(guildId);
	},
};