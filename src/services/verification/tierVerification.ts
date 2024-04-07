import { findTier } from '../../database/dataRepository/tierRepository';

const verifyTierExists = async (guildId: string, tier: string) => {
	try {
		const raidTier = await findTier(guildId, tier);

		return tier != null;
	}
	catch (err) {
		console.error('There was an issue verifying the raid', err);
	}
};

export { verifyTierExists };