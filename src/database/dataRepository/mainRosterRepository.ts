import mainRoster from '../models/mainRoster';
import { sequelize } from '../models';
import MainRoster from '../models/mainRoster';

const addTankToRoster = async (rosterId: number, user: string, role:string) => {
	try {
		const [createRoster, created] = await mainRoster.findOrCreate({
			where: {
				id: rosterId,
			},

			defaults: {
				id: rosterId,
				tanks: [user],
			},
		});

		if (!created) {
			const updateMainRoster = await mainRoster.update({ tanks: sequelize.fn('array_append', sequelize.col('tanks'), user) },
				{
					where: {
						id: rosterId,
					},
				});

			return created ? updateMainRoster : null;
		}

		return created ? createRoster : null;
	}
	catch (e) {
		console.error('Error saving to roster', e);
	}
};

const addHealerToRoster = async (rosterId: number, user: string, role:string) => {
	try {
		const [createRoster, created] = await mainRoster.findOrCreate({
			where: {
				id: rosterId,
			},

			defaults: {
				id: rosterId,
				healers: [user],
			},
		});

		if (!created) {
			const updateMainRoster = await mainRoster.update({ healers: sequelize.fn('array_append', sequelize.col('healers'), user) },
				{
					where: {
						id: rosterId,
					},
				});

			return created ? updateMainRoster : null;
		}

		return created ? createRoster : null;
	}
	catch (e) {
		console.error('Error saving to roster', e);
	}

};

const addDpsToRoster = async (rosterId: number, user: string, role:string) => {
	try {
		const [createRoster, created] = await mainRoster.findOrCreate({
			where: {
				id: rosterId,
			},

			defaults: {
				id: rosterId,
				dps: [user],
			},
		});

		if (!created) {
			const updateMainRoster = await mainRoster.update({ dps: sequelize.fn('array_append', sequelize.col('dps'), user) },
				{
					where: {
						id: rosterId,
					},
				});

			return created ? updateMainRoster : null;
		}

		return created ? createRoster : null;
	}
	catch (e) {
		console.error('Error saving to roster', e);
	}
};

const getMainRoster = async (id: number) => {
	try {
		const findMainRoster = await MainRoster.findOne({
			where: {
				id: id,
			},
		});

		return findMainRoster != null ? findMainRoster : null;
	}
	catch (e) {
		console.error('Unable to find main roster', e);
	}
};

const removeTankFromRoster = async (id: number, user: string) => {
	try {
		const remove = await MainRoster.update(
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

const removeHealerFromRoster = async (id: number, user: string) => {
	try {
		const remove = await MainRoster.update(
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

const removeDpsFromRoster = async (id: number, user: string) => {
	try {
		const remove = await MainRoster.update(
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

export { addTankToRoster, addHealerToRoster, addDpsToRoster, getMainRoster, removeTankFromRoster, removeHealerFromRoster, removeDpsFromRoster };