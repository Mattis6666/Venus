import mongoose from 'mongoose';
import { Languages } from '../../interfaces/Languages';

export interface Guild extends mongoose.Document {
    readonly guild: string; // The guild ID
    settings: {
        prefix: string;
        language: Languages;
        nsfw: boolean; // Whether NSFW commands are enabled or not
        blockedChannels: string[]; // An array of IDs of blocked channels (No commands here)
        blockedUsers: string[]; // An array of IDs of blocked users (Unable to use commands)
        disabledCommands: string[]; // An array of blocked commands
        deleteCommandTriggers: boolean; // Whether or not to delete command triggers after success
        deleteFailedCommands: boolean; // Whether or not to delete triggers and response of failed commands
    };
    roles: {
        admins: [
            {
                id: string; // The ID of the user or role that should be considered a bot admin
                whatType: 'role' | 'member'; // Its type
            }
        ];
        mods: [
            {
                id: string; // See above omegalul
                whatType: 'role' | 'member';
            }
        ];
        muted: string; // The ID of the mute role
    };
    channels: {
        welcomeChannel: string; // The IDs of the respective channels
        modLogChannel: string;
        messageLogChannel: string;
        memberLogChannel: string;
        automodLogChannel: string;
        serverLogChannel: string;
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
        admins: [
            {
                id: String,
                whatType: String
            }
        ],
        mods: [
            {
                id: String,
                whatType: String
            }
        ],
        muted: String
    },
    channels: {
        welcomeChannel: String,
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
    }
});

const guild = mongoose.model<Guild>('Guilds', GuildSchema);
export default guild;
