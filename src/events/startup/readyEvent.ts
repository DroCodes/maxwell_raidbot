import {Events} from "discord.js";
import guildSettings from "../../database/models/guildSettings";
import raidSettings from "../../database/models/raidSettings";

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client: any) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
}