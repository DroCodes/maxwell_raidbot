import {Model} from "sequelize";
import {ITierInstance} from "./ITierAttributes";


interface IGuildSettingsAttributes {
    guildId: string;
    botChannelId?: string;
    // tier?: ITierInstance[]
}

export interface IGuildSettingsInstance
    extends Model<IGuildSettingsAttributes>,
        IGuildSettingsAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}