import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';

const verifyBotChannel = async (guildId: string, channelId: string) => {
	try {
		const guild = await findGuildById(guildId);

		return guild?.botChannelId == channelId;
	}
	catch (err) {
		console.error('There was an issue verifying the bot channel', err);
	}
};

export { verifyBotChannel };