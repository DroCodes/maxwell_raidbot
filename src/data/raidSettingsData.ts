import RaidSettings from "../database/models/raidSettings";
import RaidEmoji from "../database/models/raidEmoji";

const findRaidSettings = async (guildId: string)=> {
    try {
        const findRaid = await RaidSettings.findOne({
            where: {
                GuildSettingsId: guildId
            }
        })

        return findRaid != null ? findRaid : null
    } catch (err) {
        console.error('error finding raid', err)
    }
};

const saveRaidChannelGroup = async (guildId: string, channelId: string) => {

    try {
        const [raidSettings, created] = await RaidSettings.findOrCreate({
            where: {
                GuildSettingsId: guildId
            },
            defaults: {
                raidChannelGroup: channelId,
                GuildSettingsId: guildId
            }
        })

        if (!created) {
            const updateRaidChannelGroup = await RaidSettings.update({raidChannelGroup: channelId},
                {
                    where: {
                        GuildSettingsId: guildId
                    }
                })

            if (updateRaidChannelGroup != null) {
                return updateRaidChannelGroup
            } else {
                return null
            }
        }

        return created ? raidSettings : created
    } catch (err) {
        console.error('error saving channel group', err)
    }
};

const saveSignUpEmoji = async (guildId: string, role: string, emoji: string) => {
    try {
        const raidSettings = await findRaidSettings(guildId);
        if (raidSettings === null || raidSettings === undefined) return null

        // if (!raidSettings.raidEmoji) {
        //     raidSettings.raidEmoji = []; // Initialize raidEmoji as an empty array if it is null
        // }

        // raidSettings.raidEmoji?.push(newRaidEmoji)
        // await raidSettings.save();

        return await RaidEmoji.create({
            role: role,
            emoji: emoji,
            RaidSettingsId: raidSettings.id as number
        });
    } catch (err) {
        console.error('error saving role/emoji', err)
    }
}


export { findRaidSettings, saveRaidChannelGroup, saveSignUpEmoji };