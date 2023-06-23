import {Model} from "sequelize";

interface IRoleAttributes {
    id: number;
    roleName?: string;
    TierId: number;
}

export interface IRoleInstance
    extends Model<IRoleAttributes>,
        IRoleAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}