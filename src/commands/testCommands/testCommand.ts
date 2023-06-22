import {SlashCommandBuilder} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('responds with pong'),

    async execute(interaction: any) {
        interaction.reply('pong!')
    }
}