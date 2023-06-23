import GuildSettings from "../database/models/guildSettings";


const findGuildById = async (guildId: string) => {
    try {
        const findGuild = await GuildSettings.findByPk(guildId)

        return findGuild != null ? findGuild : null;
    } catch (err) {
        console.error('There was an issue retrieving the guild id', err)
    }
}

const saveGuildId = async (guildId: string) => {
    try {
        const [guildSettings, created] = await GuildSettings.findOrCreate(
            {
                where: {
                    guildId: guildId
                },
                defaults: {
                    guildId: guildId
                }
            });

        return created ? guildSettings : created;
    } catch (err) {
        console.error('There was an issue saving the guild id', err)
    }
}

const saveBotChannelId = async (guildId: string, channelId: string)=> {
    try {
        const saveChannel = await GuildSettings.update({ botChannelId: channelId },
            {
                where: {
                    guildId: guildId
                }
            }
        )

        return !!saveChannel;
    } catch (err) {
        console.error('There was an issue saving the channel id', err)
    }
}

export { saveGuildId, saveBotChannelId, findGuildById }