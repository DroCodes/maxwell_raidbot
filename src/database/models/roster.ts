import { sequelize } from './index';
import { IRosterInstance } from '../../interfaces/databaseInterfaces/IRosterAttributes';
import { DataTypes } from 'sequelize';
import RaidEmoji from './raidEmoji';
import RaidSettings from './raidSettings';
import MainRoster from './mainRoster';
import OverflowRoster from './overflowRoster';

const Roster = sequelize.define<IRosterInstance>(
	'Roster',
	{
		id: {
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			unique: true,
		},

		raidName: {
			allowNull: false,
			type: DataTypes.TEXT,
		},

		// mainRoster: {
		// 	type: DataTypes.ARRAY(DataTypes.JSONB),
		// 	allowNull: true,
		// },
		//
		// overFlowRoster: {
		// 	type: DataTypes.ARRAY(DataTypes.JSONB),
		// 	allowNull: true,
		// },

		// tanks: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// },
		//
		// healers: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// },
		//
		// dps: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		// },

		raidId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
);

Roster.belongsTo(MainRoster, {
	foreignKey: 'id',
	as: 'mainRosterTable',
	onDelete: 'CASCADE',
});

Roster.belongsTo(OverflowRoster, {
	foreignKey: 'id',
	as: 'overflowRosterTable',
	onDelete: 'CASCADE',
});

export default Roster;