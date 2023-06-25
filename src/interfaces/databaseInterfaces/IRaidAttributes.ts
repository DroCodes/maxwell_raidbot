import { Model } from 'sequelize';

interface IRaidAttributes {
    id?: number;
    info?: string,
    raidName?: string;
    raidTier?: string,
    raidRoles?: number[];
    raidDateTime?: Date;
    GuildSettingsId?: string;
}

export interface IRaidInstance
    extends Model<IRaidAttributes>,
        IRaidAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}