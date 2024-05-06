import RaidSettings from '../models/raidSettings';
import RaidEmoji from '../models/raidEmoji';
import raidEmoji from '../models/raidEmoji';

const findRaidSettings = async (guildId: string) => {
	try {
		const findRaid = await RaidSettings.findOne({
			where: {
				GuildSettingsId: guildId,
			},
		});

		return findRaid != null ? findRaid : null;
	}
	catch (err) {
		console.error('error finding raid', err);
	}
};

const saveRaidChannelGroup = async (guildId: string, channelId: string) => {

	try {
		const [raidSettings, created] = await RaidSettings.findOrCreate({
			where: {
				GuildSettingsId: guildId,
			},
			defaults: {
				raidChannelGroup: channelId,
				GuildSettingsId: guildId,
			},
		});

		if (!created) {
			const updateRaidChannelGroup = await RaidSettings.update({ raidChannelGroup: channelId },
				{
					where: {
						GuildSettingsId: guildId,
					},
				});

			if (updateRaidChannelGroup != null) {
				return updateRaidChannelGroup;
			}
			else {
				return null;
			}
		}

		return created ? raidSettings : created;
	}
	catch (err) {
		console.error('error saving channel group', err);
	}
};

const saveRaidEmoji = async (guildId: string, role: string, emoji: string, raidRole: string) => {
	try {
		const raidSettings = await findRaidSettings(guildId);
		if (raidSettings === null || raidSettings === undefined) return null;

		return await RaidEmoji.create({
			role: role,
			emoji: emoji,
			raidRole: raidRole,
			RaidSettingsId: raidSettings.id as number,
		});
	}
	catch (err) {
		console.error('error saving role/emoji', err);
	}
};

const getRaidEmoji = async (raidSettingsId: number) => {
	try {
		const getEmoji = await raidEmoji.findAll({
			where: {
				RaidSettingsId: raidSettingsId,
			},
		});

		return getEmoji != null ? getEmoji : null;
	}
	catch (err) {
		console.error('error getting role/emoji', err);
	}
};

const saveRaidLead = async (guildId: string, raidLeadId: string) => {
	try {
		const raidSettings = await findRaidSettings(guildId);
		if (raidSettings === null || raidSettings === undefined) return null;

		const updateRaidLead = await RaidSettings.update({ raidLeadId: raidLeadId },
			{
				where: {
					GuildSettingsId: guildId,
				},
			});

		if (updateRaidLead != null) {
			return updateRaidLead;
		}
		else {
			return null;
		}
	}
	catch (err) {
		console.error('error saving raid lead', err);
	}
};


export { findRaidSettings, saveRaidChannelGroup, saveRaidEmoji, getRaidEmoji, saveRaidLead };