import {Model} from "sequelize";
import {IRaidEmojiInstance} from "./IRaidEmojiAttributes";

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