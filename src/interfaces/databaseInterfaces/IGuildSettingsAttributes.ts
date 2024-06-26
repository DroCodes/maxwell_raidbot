import { Model } from 'sequelize';


interface IGuildSettingsAttributes {
    guildId: string;
    botChannelId?: string;
    adminChannelId?: string;
}

export interface IGuildSettingsInstance
    extends Model<IGuildSettingsAttributes>,
        IGuildSettingsAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}