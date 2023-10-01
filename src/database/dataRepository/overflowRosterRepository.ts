import { sequelize } from '../models';
import OverflowRoster from '../models/overflowRoster';
import MainRoster from '../models/mainRoster';

const addTankToOverflow = async (rosterId: number, user: string, role:string) => {
	try {
		const [createOverflow, created] = await OverflowRoster.findOrCreate({
			where: {
				id: rosterId,
			},

			defaults: {
				id: rosterId,
				tanks: [user],
			},
		});

		if (!created) {
			const updateOverflow = await OverflowRoster.update({ tanks: sequelize.fn('array_append', sequelize.col('tanks'), user) },
				{
					where: {
						id: rosterId,
					},
				});

			return created ? updateOverflow : null;
		}

		return created ? createOverflow : null;
	}
	catch (e) {
		console.error('Error saving to roster', e);
	}
};

const addHealerToOverflow = async (rosterId: number, user: string, role:string) => {
	try {
		const [createOverflow, created] = await OverflowRoster.findOrCreate({
			where: {
				id: rosterId,
			},

			defaults: {
				id: rosterId,
				healers: [user],
			},
		});

		if (!created) {
			const updateOverflow = await OverflowRoster.update({ healers: sequelize.fn('array_append', sequelize.col('healers'), user) },
				{
					where: {
						id: rosterId,
					},
				});

			return created ? updateOverflow : null;
		}

		return created ? createOverflow : null;
	}
	catch (e) {
		console.error('Error saving to roster', e);
	}

};

const addDpsToOverflow = async (rosterId: number, user: string, role:string) => {
	try {
		const [createOverflow, created] = await OverflowRoster.findOrCreate({
			where: {
				id: rosterId,
			},

			defaults: {
				id: rosterId,
				dps: [user],
			},
		});

		if (!created) {
			const updateOverflow = await OverflowRoster.update({ dps: sequelize.fn('array_append', sequelize.col('dps'), user) },
				{
					where: {
						id: rosterId,
					},
				});

			return created ? updateOverflow : null;
		}

		return created ? createOverflow : null;
	}
	catch (e) {
		console.error('Error saving to roster', e);
	}
};

const getOverflow = async (id: number) => {
	try {
		const findOverflow = await OverflowRoster.findOne({
			where: {
				id: id,
			},
		});

		return findOverflow != null ? findOverflow : null;
	}
	catch (e) {
		console.error('Unable to find main roster', e);
	}
};

const removeTankFromOverflow = async (id: number, user: string) => {
	try {
		const remove = await OverflowRoster.update(
			{
				tanks: sequelize.fn('array_remove', sequelize.col('tanks'), user),
			},
			{
				where: {
					id: id,
				},
			},
		);

		return remove.length > 0 ? remove : null;
	}
	catch (e) {
		console.error('Unable to remove tank from roster');
	}
};

const removeHealerFromOverflow = async (id: number, user: string) => {
	try {
		const remove = await OverflowRoster.update(
			{
				healers: sequelize.fn('array_remove', sequelize.col('healers'), user),
			},
			{
				where: {
					id: id,
				},
			},
		);

		return remove.length > 0 ? remove : null;
	}
	catch (e) {
		console.error('Unable to remove tank from roster');
	}
};

const removeDpsFromOverflow = async (id: number, user: string) => {
	try {
		const remove = await OverflowRoster.update(
			{
				dps: sequelize.fn('array_remove', sequelize.col('dps'), user),
			},
			{
				where: {
					id: id,
				},
			},
		);

		return remove.length > 0 ? remove : null;
	}
	catch (e) {
		console.error('Unable to remove tank from roster');
	}
};

const deleteOverflow = async (rosterId: number) => {
	try {
		const del = await OverflowRoster.destroy({
			where: {
				id: rosterId,
			},
		});

		return !!del;
	}
	catch (e) {
		console.error('error deleting main Roster ' + e);
	}
};

export { addTankToOverflow, addHealerToOverflow, addDpsToOverflow, getOverflow, removeTankFromOverflow, removeHealerFromOverflow, removeDpsFromOverflow, deleteOverflow };