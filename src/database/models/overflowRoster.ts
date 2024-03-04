import { sequelize } from './index';
import { DataTypes } from 'sequelize';
import { IOverflowRosterInstance } from '../../interfaces/databaseInterfaces/IOverflowRosterAttributes';
import Roster from './roster';

const OverflowRoster = sequelize.define<IOverflowRosterInstance>('OverflowRoster', {
	id: {
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
		type: DataTypes.INTEGER,
	},
	tanks: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: true,
	},
	healers: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: true,
	},
	dps: {
		type: DataTypes.ARRAY(DataTypes.STRING),
		allowNull: true,
	},
});

export default OverflowRoster;