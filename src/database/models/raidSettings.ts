import { DataTypes } from "sequelize";
import {
    IRaidSettingsInstance
} from '../../interfaces/databaseInterfaces/IRaidSettingsAttributes'
import { sequelize } from "./index";

const RaidSettings = sequelize.define<IRaidSettingsInstance>(
    'RaidSettings',
    {
        // id: {
        //     allowNull: false,
        //     autoIncrement: true,
        //     primaryKey: true,
        //     type: DataTypes.NUMBER,
        //     unique: true,
        // },
        raidChannelGroup: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        signUpEmoji: {
            allowNull: true,
            type: DataTypes.TEXT,
        }
    });

export default RaidSettings