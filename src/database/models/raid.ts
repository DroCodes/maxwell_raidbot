import { sequelize } from './index';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { DataTypes } from 'sequelize';
import RaidSettings from './raidSettings';
import RaidEmoji from './raidEmoji';
import Roster from './roster';

const Raid = sequelize.define<IRaidInstance>(
	'Raid',
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

		info: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		raidLead: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		raidTier: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		// raidRoles: {
		// 	allowNull: true,
		// 	type: DataTypes.ARRAY(DataTypes.TEXT),
		// },

		tanks: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		healers: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		dps: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		raidDateTime: {
			allowNull: true,
			type: DataTypes.DATE,
		},

		raidChannelId: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		GuildSettingsId: {
			allowNull: false,
			type: DataTypes.TEXT,
		},
	},
);

Raid.hasOne(Roster, {
	sourceKey: 'id',
	foreignKey: 'raidId',
	as: 'Roster',
	onDelete: 'CASCADE',
});

Roster.belongsTo(Raid, {
	foreignKey: 'raidId',
	as: 'Raid',
	onDelete: 'CASCADE',
});

export default Raid;