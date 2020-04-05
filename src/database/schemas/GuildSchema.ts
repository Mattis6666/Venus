import mongoose from 'mongoose';

export interface Guild extends mongoose.Document {
    readonly guild: string;
    settings: {
        prefix: string;
        nsfw: boolean;
        blockedChannels: string[];
        disabledCommands: string[];
        deleteCommandTriggers: boolean;
        deleteFailedCommands: boolean;
    };
    roles: {
        admin: string[];
        mod: string[];
        muted: string;
    };
    channels: {
        welcomeChannel: string;
        modLogChannel: string;
        messageLogChannel: string;
        memberLogChannel: string;
        automodLogChannel: string;
        serverLogChannel: string;
    };
}

const GuildSchema: mongoose.Schema = new mongoose.Schema({
    guild: String,
    settings: {
        prefix: String,
        nsfw: Boolean,
        blockedChannels: [String],
        disabledCommands: [String],
        deleteCommandTriggers: Boolean,
        deleteFailedCommands: Boolean
    },
    roles: {
        admin: [String],
        mod: [String],
        muted: String
    },
    channels: {
        welcomeChannel: String,
        modLogChannel: String,
        messageLogChannel: String,
        memberLogChannel: String,
        automodLogChannel: String,
        serverLogChannel: String
    }
});

const guild = mongoose.model<Guild>('Guilds', GuildSchema);
export default guild;
