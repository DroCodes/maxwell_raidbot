import GuildSettings from '../models/guildSettings';


const findGuildById = async (guildId: string) => {
	try {
		const findGuild = await GuildSettings.findByPk(guildId);

		return findGuild != null ? findGuild : null;
	}
	catch (err) {
		console.error('There was an issue retrieving the guild id', err);
	}
};

const saveGuildId = async (guildId: string) => {
	try {
		const [guildSettings, created] = await GuildSettings.findOrCreate(
			{
				where: {
					guildId: guildId,
				},
				defaults: {
					guildId: guildId,
				},
			});

		return created ? guildSettings : created;
	}
	catch (err) {
		console.error('There was an issue saving the guild id', err);
	}
};

const saveBotChannelId = async (guildId: string, channelId: string) => {
	try {
		const saveChannel = await GuildSettings.update({ botChannelId: channelId },
			{
				where: {
					guildId: guildId,
				},
			},
		);

		return !!saveChannel;
	}
	catch (err) {
		console.error('There was an issue saving the channel id', err);
	}
};

const saveAdminChannel = async (guildId: string, channelId: string) => {
	try {
		const saveChannel = await GuildSettings.update({ adminChannelId: channelId },
			{
				where: {
					guildId: guildId,
				},
			},
		);

		return !!saveChannel;
	}
	catch (err) {
		console.error('There was an issue saving the channel id', err);
	}
};

const getSettings = async (guildId: string) => {
	try {
		const settings = await GuildSettings.findOne({ where: { guildId: guildId } });

		if (settings === null || settings === undefined) {
			return null;
		}

		return settings;
	}
	catch (err) {
		console.error('There was an issue retrieving the settings', err);
	}

};

export { saveGuildId, saveBotChannelId, findGuildById, getSettings, saveAdminChannel };