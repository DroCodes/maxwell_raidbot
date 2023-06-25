import { sequelize } from './index';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { DataTypes } from 'sequelize';

const Raid = sequelize.define<IRaidInstance>(
	'Raid',
	{
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.INTEGER,
			unique: true,
		},

		info: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		raidName: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		raidTier: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		raidRoles: {
			allowNull: true,
			type: DataTypes.ARRAY(DataTypes.TEXT),
		},

		raidDateTime: {
			allowNull: true,
			type: DataTypes.DATE,
		},

		GuildSettingsId: {
			allowNull: true,
			type: DataTypes.TEXT,
		},
	},
);

export default Raid;