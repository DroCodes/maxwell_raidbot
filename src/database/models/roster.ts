import { sequelize } from './index';
import { IRosterInstance } from '../../interfaces/databaseInterfaces/IRosterAttributes';
import { DataTypes } from 'sequelize';
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

		raidId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
);

// Roster.belongsTo(MainRoster, {
// 	foreignKey: 'id',
// 	as: 'mainRosterTable',
// 	onDelete: 'CASCADE',
// });
//
// Roster.belongsTo(OverflowRoster, {
// 	foreignKey: 'id',
// 	as: 'overflowRosterTable',
// 	onDelete: 'CASCADE',
// });

Roster.hasOne(MainRoster, { foreignKey: 'id', as: 'mainRoster' });
Roster.hasOne(OverflowRoster, { foreignKey: 'id', as: 'overflowRoster' });

export default Roster;