import Tier from '../models/tier';
import { sequelize } from '../models';
import { JSON, json } from 'sequelize';

const findTier = async (guildId: string, tierName: string) => {
	try {
		const getTier = await Tier.findOne({
			where: {
				GuildSettingsId: guildId,
				tierName: tierName,
			},
		});

		return getTier != null ? getTier : null;
	}
	catch (err) {
		console.error('Error saving tier' + err);
	}
};

const findAllTiers = async (guildId: string) => {
	try {
		const getAllTiers = await Tier.findAll({ where: { GuildSettingsId: guildId } });
		return getAllTiers.length != 0 ? getAllTiers : null;
	}
	catch (err) {
		console.error('Error finding tiers' + err);
	}
};

const createTier = async (guildId: string, tierName: string, roleName: string, isRestricted: boolean | null) => {
	try {
		if (isRestricted === null) {
			isRestricted = false;
		}

		const [saveTier, created] = await Tier.findOrCreate({
			where: {
				GuildSettingsId: guildId,
				tierName: tierName,
			},
			defaults: {
				tierName: tierName,
				roleName: [roleName],
				GuildSettingsId: guildId,
				isRestricted: isRestricted,
			},
		});

		return created ? saveTier : created;
	}
	catch (err) {
		console.error('Error finding tier' + err);
	}
};

const addRoleToTier = async (guildId: string, tierName: string, role: string) => {
	try {
		const getTier = await findTier(guildId, tierName);
		if (getTier === null || getTier === undefined) return null;

		const addRole = await Tier.update({
			roleName: sequelize.fn('array_append', sequelize.col('roleName'), role),
		},
		{
			where: {
				GuildSettingsId: guildId,
				tierName: tierName,
			},
		});

		return addRole.length > 0;
	}
	catch (err) {
		console.error('Error adding role to tier' + err);
	}
};

const removeRoleFromTier = async (guildId: string, tierName: string, roleName: string) => {
	try {
		const getTier = await findTier(guildId, tierName);

		if (getTier === null || getTier === undefined) return null;

		const tier = getTier.roleName.indexOf(roleName);
		if (tier != -1) {
			getTier.update({
				roleName: sequelize.fn('array_remove', sequelize.col('roleName'), getTier.roleName[tier]),
			});
			return true;
		}
		return false;
	}
	catch (err) {
		console.error('Error removing role from tier' + err);
	}
};

const deleteTier = async (guildId: string, tierName: string) => {
	try {
		console.log(guildId + ' ' + tierName);
		const removeTier = await Tier.destroy({
			where: {
				GuildSettingsId: guildId,
				tierName: tierName,
			},
		});

		console.log('removeTier ' + removeTier);

		return removeTier > 0;
	}
	catch (err) {
		console.error('Error deleting tier' + err);
	}
};

export { findTier, findAllTiers, createTier, addRoleToTier, removeRoleFromTier, deleteTier };