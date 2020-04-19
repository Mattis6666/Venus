import mongoose from 'mongoose';
import { Languages } from '../../interfaces/Languages';

export type GuildChannelSettings =
    | 'welcomeChannel'
    | 'introChannel'
    | 'modLogChannel'
    | 'messageLogChannel'
    | 'memberLogChannel'
    | 'automodLogChannel'
    | 'serverLogChannel';

export interface GuildSettings {
    prefix: string;
    language: Languages;
    nsfw: boolean; // Whether NSFW commands are enabled or not
    blockedChannels: string[]; // An array of IDs of blocked channels (No commands here)
    blockedUsers: string[]; // An array of IDs of blocked users (Unable to use commands)
    disabledCommands: string[]; // An array of blocked commands
    deleteCommandTriggers: boolean; // Whether or not to delete command triggers after success
    deleteFailedCommands: boolean; // Whether or not to delete triggers and response of failed commands
}

export interface Guild extends mongoose.Document {
    readonly guild: string; // The guild ID
    settings: GuildSettings;
    roles: {
        muted: string; // The ID of the mute role
    };
    channels: {
        [key in GuildChannelSettings]: string;
    };
    permissions: [
        {
            command: string; // The name of the command this is for
            allowed: 'admin' | 'mod' | 'everyone'; // Who is allowed to use it
            users: string[]; // Array of IDs of all whitelisted  (They can use it regardless of above)
        }
    ];
    blacklist: {
        whitelist: string[]; // An array of IDs of whitelisted users
        words: string[]; // An array of blacklisted words
    };
    welcome: {
        message: string;
        autoRole: string;
    };
}

const GuildSchema: mongoose.Schema = new mongoose.Schema({
    guild: String,
    settings: {
        prefix: String,
        language: String,
        nsfw: Boolean,
        blockedChannels: [String],
        blockedUsers: [String],
        disabledCommands: [String],
        deleteCommandTriggers: Boolean,
        deleteFailedCommands: Boolean
    },
    roles: {
        muted: String
    },
    channels: {
        welcomeChannel: String,
        introChannel: String,
        modLogChannel: String,
        messageLogChannel: String,
        memberLogChannel: String,
        automodLogChannel: String,
        serverLogChannel: String
    },
    permissions: [
        {
            command: String,
            allowed: String,
            users: [String]
        }
    ],
    blacklist: {
        whitelist: [String],
        words: [String]
    },
    welcome: {
        message: String,
        autoRole: String
    }
});

const guild = mongoose.model<Guild>('Guilds', GuildSchema);
export default guild;
