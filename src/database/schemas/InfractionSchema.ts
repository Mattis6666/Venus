import mongoose from 'mongoose';
import { Message } from 'discord.js';
import { InfractionTypes } from '../../interfaces/InfractionTypes';
import { ModLog } from '../../interfaces/ModLog';

export interface Infractions extends mongoose.Document {
    guild: string;
    members: [
        {
            userId: string;
            infractions: [ModLog];
        }
    ];
    createInfraction(message: Message, userId: string, type: InfractionTypes, reason: string, duration?: string): Promise<ModLog>;
}

const InfractionSchema: mongoose.Schema = new mongoose.Schema({
    guild: String,
    members: [
        {
            userId: String,
            infractions: [
                {
                    infractionType: String,
                    duration: String,
                    reason: String,
                    moderator: {
                        id: String,
                        username: String
                    },
                    date: Date
                }
            ]
        }
    ]
});

InfractionSchema.methods.createInfraction = async (message: Message, userId: string, type: InfractionTypes, reason: string, duration?: string) => {
    if (!message.guild) throw new Error('Not a guild!');
    const infractionEntry = (await infractions.findOne({ guild: message.guild.id })) || (await infractions.create({ guild: message.guild.id }));
    if (!infractionEntry) throw new Error('No InfractionEntry found!');
    const modLog = infractionEntry.members.filter(member => member.userId === userId)[0];
    const infraction: ModLog = {
        infractionType: type,
        duration: duration,
        reason: reason,
        moderator: {
            id: message.author.id,
            username: message.author.tag
        },
        date: message.createdAt
    };
    if (modLog) modLog.infractions.push(infraction);
    else {
        infractionEntry.members.push({
            userId: userId,
            infractions: [infraction]
        });
    }
    infractionEntry.save();
    return infraction;
};

const infractions = mongoose.model<Infractions>('Infractions', InfractionSchema);
export default infractions;
