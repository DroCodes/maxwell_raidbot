import { DataTypes } from "sequelize";
import { IGuildSettingsInstance } from '../../interfaces/databaseInterfaces/IGuildSettingsAttributes'
import { sequelize } from "./index";
import RaidSettings from "./raidSettings";

const GuildSettings = sequelize.define<IGuildSettingsInstance>(
    'GuildSettings',
    {
        guildId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true,
        },
        botChannelId: {
            allowNull: true,
            type: DataTypes.TEXT,
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

export default GuildSettings;
