import { DataTypes } from 'sequelize';
import {
	IRaidSettingsInstance,
} from '../../interfaces/databaseInterfaces/IRaidSettingsAttributes';
import { sequelize } from './index';
import RaidEmoji from './raidEmoji';

const RaidSettings = sequelize.define<IRaidSettingsInstance>(
	'RaidSettings',
	{
		id: {
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			unique: true,
		},

		raidChannelGroup: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		// raidEmoji: {
		//     allowNull: true,
		//     type: DataTypes.ARRAY(DataTypes.JSONB),
		// },

		GuildSettingsId: {
			allowNull: false,
			type: DataTypes.TEXT,
		},
	});

RaidSettings.hasMany(RaidEmoji, {
	sourceKey: 'id',
	foreignKey: 'RaidSettingsId',
	as: 'RaidEmoji',
	onDelete: 'CASCADE',
});

RaidEmoji.belongsTo(RaidSettings, {
	foreignKey: 'RaidSettingsId',
	as: 'RaidSettings',
	onDelete: 'CASCADE',
});

export default RaidSettings;