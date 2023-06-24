import {Model} from "sequelize";
import {IRoleInstance} from "./IRoleAttributes";

interface ITierAttributes {
    id?: number;
    tierName: string;
    // role: IRoleInstance[];
    isRestricted?: boolean;
    GuildSettingsId: string;
}

export interface ITierInstance
    extends Model<ITierAttributes>,
        ITierAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}