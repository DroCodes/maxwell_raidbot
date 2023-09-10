import { Model } from 'sequelize';

interface IOverflowRosterAttributes {
    id?: number;
    tanks: string[] | null;
    healers: string[] | null;
    dps: string[] | null;
}

export interface IOverflowRosterInstance
    extends Model<IOverflowRosterAttributes>,
        IOverflowRosterAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}