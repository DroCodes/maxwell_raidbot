import { sequelize } from './index';
import { ITierInstance } from '../../interfaces/databaseInterfaces/ITierAttributes';
import { DataTypes } from 'sequelize';
import Role from './role';

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

Tier.hasMany(Role, {
	sourceKey: 'id',
	foreignKey: 'TierId',
	as: 'Role',
	onDelete: 'CASCADE',
});

Role.belongsTo(Tier, {
	foreignKey: 'TierId',
	as: 'Tier',
	onDelete: 'CASCADE',
});

export default Tier;