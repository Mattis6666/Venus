import mongoose from 'mongoose';
import { Message } from 'discord.js';

export interface Guild extends mongoose.Document {
    readonly guildId: string;
    settings: {
        prefix: string;
        welcomeChannel: string;
        botChannel: string;
        blockedChannels: string[];
        disabledCommands: string[];
    };
    roles: {
        admin: string;
        mod: string;
    };
    modLog: [
        {
            readonly userId: string;
            warns: [
                {
                    reason: string;
                    moderator: {
                        id: string;
                        username: string;
                    };
                    date: Date;
                }
            ];
        }
    ];
    createWarn(message: Message, userId: string, reason: string): CallableFunction;
}

const GuildSchema: mongoose.Schema = new mongoose.Schema({
    guildId: String,
    settings: {
        prefix: String,
        welcomeChannel: String,
        botChannel: String,
        blockedChannels: [String],
        disabledCommands: [String]
    },
    roles: {
        admin: String,
        mod: String
    },
    modLog: [
        {
            userId: String,
            warns: [
                {
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

GuildSchema.methods.createWarn = async (message: Message, userId: string, reason: string) => {
    if (!message.guild) throw new Error('Not a guild!');
    const guildSettings = (await guild.findOne({ guildId: message.guild.id })) || (await guild.create({ guildId: message.guild.id }));
    if (!guildSettings) throw new Error('No guild settings found!');
    const modLog = guildSettings.modLog.filter(warn => warn.userId === userId)[0];
    const warn = {
        reason: reason,
        moderator: {
            id: message.author.id,
            username: message.author.tag
        },
        date: message.createdAt
    };
    if (modLog) modLog.warns.push(warn);
    else {
        guildSettings.modLog.push({
            userId: userId,
            warns: [warn]
        });
    }
    guildSettings.save();
    return warn;
};

const guild = mongoose.model<Guild>('guilds', GuildSchema);
export default guild;
