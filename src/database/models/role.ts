import {sequelize} from "./index";
import {IRoleInstance} from "../../interfaces/databaseInterfaces/IRoleAttributes";
import {DataTypes} from "sequelize";

const Role = sequelize.define<IRoleInstance>(
    'Role',
    {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            unique: true
        },

        roleName: {
            allowNull: false,
            type: DataTypes.TEXT
        },

        TierId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        }
    }
)

export default Role;