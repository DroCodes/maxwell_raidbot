import { Events, Guild } from 'discord.js';
import { saveGuildId } from '../../database/dataRepository/guildSettingsRepository';

module.exports = {
	name: Events.GuildCreate,
	isDevelopment: true,

	async execute(guild: Guild) {
		const checkGuildExists = await saveGuildId(guild.id.toString());

		if (!checkGuildExists) {
			return;
		}
	},
};