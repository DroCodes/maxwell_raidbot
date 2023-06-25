import { Model } from 'sequelize';

interface IRaidSettingsAttributes {
    id?: number;
    raidChannelGroup?: string;
    // raidEmoji?: IRaidEmojiInstance[];
    GuildSettingsId: string;
}

export interface IRaidSettingsInstance
    extends Model<IRaidSettingsAttributes>,
        IRaidSettingsAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}