import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';

const verifyGuildExists = async (guildId: string) => {
	try {
		const guild = await findGuildById(guildId);

		return guild != null;
	}
	catch (err) {
		console.error('There was an issue verifying the guild', err);
	}
};

export { verifyGuildExists };