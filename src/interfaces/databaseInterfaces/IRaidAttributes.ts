import { Model } from 'sequelize';

interface IRaidAttributes {
    id?: number;
    raidName: string;
    info?: string,
    raidLead?: string
    raidTier?: string,
    tanks?: string;
    healers?: string;
    dps?: string;
    raidDateTime?: Date;
    raidChannelId?: string;
    threadChannelId?: string;
    infoMsgId?: string;
    rosterMsgId?: string;
    isOpen: boolean;
    GuildSettingsId: string;
}

export interface IRaidInstance
    extends Model<IRaidAttributes>,
        IRaidAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}