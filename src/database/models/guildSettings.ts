import { DataTypes } from "sequelize";
import { IGuildSettingsInstance } from '../../interfaces/databaseInterfaces/IGuildSettingsAttributes'
import { sequelize } from "./index";
import RaidSettings from "./raidSettings";
import Tier from "./tier";

const GuildSettings = sequelize.define<IGuildSettingsInstance>(
    'GuildSettings',
    {
        guildId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.TEXT,
            unique: true,
        },
        botChannelId: {
            allowNull: true,
            type: DataTypes.TEXT,
        },

        tier: {
            allowNull: true,
            type: DataTypes.ARRAY(DataTypes.JSONB),
        },
    });

GuildSettings.hasOne(RaidSettings, {
    sourceKey: 'guildId',
    foreignKey: 'GuildSettingsId',
    as: 'RaidSettings',
    onDelete: 'CASCADE'
})

RaidSettings.belongsTo(GuildSettings, {
    foreignKey: 'GuildSettingsId',
    as: 'GuildSettings',
    onDelete: 'CASCADE'
})

GuildSettings.hasMany(Tier, {
    sourceKey: 'guildId',
    foreignKey: 'GuildSettingsId',
    as: 'Tier',
    onDelete: 'CASCADE'
})

Tier.belongsTo(GuildSettings, {
    foreignKey: 'GuildSettingsId',
    as: 'GuildSettings',
    onDelete: 'CASCADE'
})

export default GuildSettings;
