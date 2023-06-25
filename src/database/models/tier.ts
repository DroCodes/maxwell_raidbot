import { sequelize } from './index';
import { ITierInstance } from '../../interfaces/databaseInterfaces/ITierAttributes';
import { DataTypes } from 'sequelize';

const Tier = sequelize.define < ITierInstance > (
	'Tier',
	{
		id: {
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			unique: true,
		},

		tierName: {
			allowNull: false,
			type: DataTypes.STRING,
		},

		roleName: {
			allowNull: true,
			type: DataTypes.ARRAY(DataTypes.TEXT),
		},

		isRestricted: {
			allowNull: true,
			defaultValue: false,
			type: DataTypes.BOOLEAN,
		},

		GuildSettingsId: {
			allowNull: false,
			type: DataTypes.TEXT,
		},
	},
);

export default Tier;