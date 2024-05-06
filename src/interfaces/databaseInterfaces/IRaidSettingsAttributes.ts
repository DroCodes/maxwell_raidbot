import { Model } from 'sequelize';

interface IRaidSettingsAttributes {
    id?: number;
    raidChannelGroup?: string;
    raidLeadId?: string;
    GuildSettingsId: string;
}

export interface IRaidSettingsInstance
    extends Model<IRaidSettingsAttributes>,
        IRaidSettingsAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}