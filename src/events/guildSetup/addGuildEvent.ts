import {Events, Guild} from "discord.js";
import GuildSettings from "../../database/models/guildSettings";
import {saveGuildId} from "../../data/guildSettingsData";

module.exports = {
    name: Events.GuildCreate,
    isDevelopment: true,

    async execute(guild: Guild)  {
        const checkGuildExists = await saveGuildId(guild.id.toString())

        if (!checkGuildExists) {
            return
        }
    }

}