import { InfractionTypes } from './InfractionTypes';

export interface ModLog {
    infractionType: InfractionTypes;
    duration?: string;
    reason: string;
    moderator: {
        id: string;
        username: string;
    };
    date: Date;
}
