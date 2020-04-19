import mongoose from 'mongoose';
import { Message } from 'discord.js';
import { InfractionTypes } from '../../interfaces/InfractionTypes';

export interface Infraction extends mongoose.Document {
    guild: string;
    user: string;
    infractionType: string;
    timestamp: number;
    endTimestamp?: number;
    reason: string;
    moderator: {
        id: string;
        tag: string;
    };
    case: number;
}

const InfractionSchema: mongoose.Schema = new mongoose.Schema({
    guild: String,
    user: String,
    infractionType: String,
    timestamp: Number,
    endTimestamp: Number,
    reason: String,
    moderator: {
        id: String,
        tag: String
    },
    case: Number
});

const infractions = mongoose.model<Infraction>('Infractions', InfractionSchema);
export default infractions;

export const createInfraction = async (message: Message, userId: string, infractionType: InfractionTypes, reason: string, duration?: number) => {
    if (!message.guild) throw new Error('USED IN A DM YOU MORON');
    const cases = (await infractions.find({ guild: message.guild.id })).map(i => i.case);
    const end = duration ? message.createdTimestamp + duration : null;
    const infraction = await infractions.create({
        guild: message.guild.id,
        user: userId,
        infractionType: infractionType,
        timestamp: message.createdTimestamp,
        endTimestamp: end,
        reason: reason,
        moderator: {
            id: message.author.id,
            tag: message.author.tag
        },
        case: (cases.length ? Math.max(...cases) : 0) + 1
    });
    infraction.save();
    return infraction;
};
