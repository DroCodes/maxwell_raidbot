import { DataTypes } from 'sequelize';
import { sequelize } from './index';
import { IMainRosterInstance } from '../../interfaces/databaseInterfaces/IMainRosterAttributes';
import Roster from './roster';

const MainRoster = sequelize.define<IMainRosterInstance>('MainRoster', {
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

export default MainRoster;