import { Model } from 'sequelize';

interface IMainRosterAttributes {
    id?: number;
    tanks: string[] | null;
    healers: string[] | null;
    dps: string[] | null;
}

export interface IMainRosterInstance
    extends Model<IMainRosterAttributes>,
        IMainRosterAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}
