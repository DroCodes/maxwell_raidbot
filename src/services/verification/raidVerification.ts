import { findRaid } from '../../database/dataRepository/raidRepository';

const verifyRaidExists = async (guildId: string, raidName: string) => {
	try {
		const raid = await findRaid(guildId, raidName);

		return raid != null;
	}
	catch (err) {
		console.error('There was an issue verifying the raid', err);
	}
};

export { verifyRaidExists };