import { Model } from 'sequelize';

interface IRaidEmojiAttributes {
    id?: number;
    role: string;
    emoji: string;
    RaidSettingsId: number;

}

export interface IRaidEmojiInstance
    extends Model<IRaidEmojiAttributes>,
        IRaidEmojiAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}