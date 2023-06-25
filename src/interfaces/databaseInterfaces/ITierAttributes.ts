import { Model } from 'sequelize';

interface ITierAttributes {
    id?: number;
    tierName: string;
    roleName: string[];
    isRestricted: boolean | null;
    GuildSettingsId: string;
}

export interface ITierInstance
    extends Model<ITierAttributes>,
        ITierAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}