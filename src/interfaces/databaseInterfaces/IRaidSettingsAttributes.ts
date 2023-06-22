import {Model} from "sequelize";

interface IRaidSettingsAttributes {
    // id: string;
    raidChannelGroup?: string;
    signUpEmoji?: Array<{ RoleName: string; EmojiName: string }>;
}

export interface IRaidSettingsInstance
    extends Model<IRaidSettingsAttributes>,
        IRaidSettingsAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}