import { sequelize } from './index';
import { DataTypes } from 'sequelize';
import { IRaidEmojiInstance } from '../../interfaces/databaseInterfaces/IRaidEmojiAttributes';

const RaidEmoji = sequelize.define<IRaidEmojiInstance>(
	'RaidEmoji',
	{
		id: {
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			unique: true,
		},

		role: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		emoji: {
			allowNull: true,
			type: DataTypes.TEXT,
		},

		RaidSettingsId: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
	});

export default RaidEmoji;