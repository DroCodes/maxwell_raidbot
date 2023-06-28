import Raid from '../models/raid';

const findRaid = async (guildId: string, raidName: string) => {
	try {
		const raid = await Raid.findOne({
			where: {
				raidName: raidName,
				GuildSettingsId: guildId,
			},
		});

		return raid != null ? raid : null;
	}
	catch (err) {
		console.error('There was an issue finding the raid');
	}
};

const findAllRaids = async (guildId: string) => {
	try {
		const raid = Raid.findAll({
			where: {
				GuildSettingsId: guildId,
			},
		});

		return raid != null ? raid : null;
	}
	catch (err) {
		console.error('There was an issue finding the raid');
	}
};

const createRaid = async (guildId: string, raidName: string, info: string) => {
	try {
		const [raid, created] = await Raid.findOrCreate(
			{
				where: {
					raidName: raidName,
					GuildSettingsId: guildId,
				},
				defaults: {
					raidName: raidName,
					info: info,
					GuildSettingsId: guildId,
				},
			});

		return created ? raid : null;
	}
	catch (err) {
		console.error('There was an issue creating the raid ', err);
		return null;
	}
};

const saveInfo = async (guildId: string, raidName: string, info: string) => {
	try {
		const raid = await Raid.update(
			{
				info: info,
			},
			{
				where: {
					GuildSettingsId: guildId,
					raidName: raidName,
				},
			},
		);

		return raid.length > 0;
	}
	catch (err) {
		console.error('There was an issue saving the raid info ', err);
	}
};


const saveRaidLead = async (guildId: string, raidName: string, raidLead: string) => {
	try {
		console.log('raidLead' + raidLead);
		console.log('raidName' + raidName);
		const raid = await Raid.update(
			{
				raidLead: raidLead,
			},
			{
				where: {
					GuildSettingsId: guildId,
					raidName: raidName,
				},
			},
		);

		return raid.length > 0;
	}
	catch (err) {
		console.error('There was an issue saving the raid lead ', err);
		return false;
	}
};

const saveRaidTier = async (guildId: string, raidName: string, raidTier: string) => {
	try {
		const raid = await Raid.update(
			{
				raidTier: raidTier,
			},
			{
				where: {
					GuildSettingsId: guildId,
					raidName: raidName,
				},
			},
		);

		return raid.length > 0;
	}
	catch (err) {
		console.error('There was an issue saving the raid tier ', err);
		return false;
	}
};

const saveRaidRoles = async (guildId: string, raidName: string, raidRoles: string[]) => {
	try {
		const raid = await Raid.update(
			{
				tanks: raidRoles[0],
				healers: raidRoles[1],
				dps: raidRoles[2],
			},
			{
				where: {
					GuildSettingsId: guildId,
					raidName: raidName,
				},
			},
		);

		return raid.length > 0;
	}
	catch (err) {
		console.error('There was an issue saving the raid roles ', err);
		return false;
	}
};

const saveRaidDate = async (guildId: string, raidName: string, raidDate: Date) => {
	try {
		const raid = await Raid.update(
			{
				raidDateTime: raidDate,
			},
			{
				where: {
					GuildSettingsId: guildId,
					raidName: raidName,
				},
			},
		);

		return raid.length > 0;
	}
	catch (err) {
		console.error('There was an issue saving the raid date ', err);
		return false;
	}
};

const saveRaidChannelId = async (guildId: string, raidName: string, channelId: string) => {
	try {
		const raid = await Raid.update(
			{
				raidChannelId: channelId,
			},
			{
				where: {
					GuildSettingsId: guildId,
					raidName: raidName,
				},
			},
		);

		return raid.length > 0;
	}
	catch (err) {
		console.error('There was an issue saving the raid channel ', err);
		return false;
	}
};

const deleteRaid = async (guildId: string, raidName: string) => {
	try {
		const raid = await Raid.destroy(
			{
				where: {
					GuildSettingsId: guildId,
					raidName: raidName,
				},
			},
		);

		return raid > 0;
	}
	catch (err) {
		console.error('There was an issue deleting the raid ', err);
		return false;
	}
};

export { findRaid, findAllRaids, createRaid, saveInfo, saveRaidLead, saveRaidTier, saveRaidRoles, saveRaidDate, saveRaidChannelId, deleteRaid };