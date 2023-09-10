import Roster from '../models/roster';
import { where } from 'sequelize';
import raid from '../models/raid';
import { sequelize } from '../models';

const getRoster = async (raidId: number) => {
	try {
		const findRoster = await Roster.findOne({
			where: {
				raidId: raidId,
			},
		});

		return findRoster != null ? findRoster : null;
	}
	catch (e) {
		console.error('Unable to find raid', e);
		return null;
	}
};

const saveRoster = async (raidId: number, raidName: string) => {
	try {
		const [createRoster, created] = await Roster.findOrCreate({
			where: {
				raidId: raidId,
				raidName: raidName,
			},
			defaults: {
				raidName: raidName,
				raidId: raidId,
			},
		});

		// if (!created) {
		// 	const updateUserRole = JSON.stringify(userRole);
		// 	const updateRoster = Roster.update({ mainRoster: sequelize.fn('array_append', sequelize.col('mainRoster'), updateUserRole) },
		// 		{
		// 			where: {
		// 				raidId: raidId,
		// 				raidName: raidName,
		// 			},
		// 		});
		//
		// 	return updateRoster != null ? updateRoster : null;
		// }

		return created ? createRoster : null;
	}
	catch (e) {
		console.error('Unable to save raid', e);
		return null;
	}
};

export { getRoster, saveRoster };