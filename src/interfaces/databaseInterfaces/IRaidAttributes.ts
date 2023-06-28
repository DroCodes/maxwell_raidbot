import { Model } from 'sequelize';

interface IRaidAttributes {
    id?: number;
    raidName: string;
    info?: string,
    raidLead?: string
    raidTier?: string,
    // raidRoles?: number[];
    tanks?: string;
    healers?: string;
    dps?: string;
    raidDateTime?: Date;
    raidChannelId?: string;
    GuildSettingsId: string;
}

export interface IRaidInstance
    extends Model<IRaidAttributes>,
        IRaidAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}