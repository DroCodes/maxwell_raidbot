import { Model } from 'sequelize';

// interface IUserRole {
//     user: string;
//     role: string;
// }
interface IRosterAttributes {
    id?: number;
    raidName: string;
    // mainRoster: IUserRole[];
    // overFlowRoster: IUserRole[];
    // tanks?: number,
    // healers?: number,
    // dps?: number
    raidId: number;
}

export interface IRosterInstance
    extends Model<IRosterAttributes>,
        IRosterAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}