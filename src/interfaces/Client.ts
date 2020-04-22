import { Collection, Client, PermissionString, Message } from 'discord.js';
import { Guild } from '../database/schemas/GuildSchema';
import { database } from '../database';
import { Tags } from '../database/schemas/TagSchema';
import { config } from '../../config';

export class VenusClient extends Client {
    commands: Collection<string, VenusCommand> = new Collection();
    guildSettings: Collection<string, Guild> = new Collection();
    languages: Collection<string, VenusStrings[]> = new Collection();
    tags: Collection<string, Tags> = new Collection();
    config = config;
    database = database;
}

export interface VenusCommand {
    name: string;
    aliases: string[];
    category: VenusCommandCategories;
    developerOnly: boolean;
    nsfw: boolean;
    guildOnly: boolean;
    dmOnly: boolean;
    requiresArgs: number;
    userPermissions: PermissionString | '';
    botPermissions: PermissionString | '';
    callback(message: Message, args: string[], language: VenusCommandStrings): Promise<Message | undefined | void> | void;
}

export interface VenusCommandStrings {
    category: string;
    description: string;
    extended: string;
    usage: string;
    [prop: string]: string;
}

export interface VenusStrings {
    command: string;
    strings: VenusCommandStrings;
}

export type VenusLanguages = 'en_GB' | 'de_DE' | 'nl_NL' | 'tr_TR';

export type VenusCommandCategories = 'DEVELOPMENT' | 'MODERATION' | 'SETTINGS' | 'UTILITY' | 'MISC' | 'FUN' | 'ANIME' | 'NSFW';

export type ClientEventTypes =
    | 'channelCreate'
    | 'channelDelete'
    | 'channelPinsUpdate'
    | 'channelUpdate'
    | 'debug'
    | 'warn'
    | 'disconnect'
    | 'emojiCreate'
    | 'emojiDelete'
    | 'emojiUpdate'
    | 'error'
    | 'guildBanAdd'
    | 'guildBanRemove'
    | 'guildCreate'
    | 'guildDelete'
    | 'guildUnavailable'
    | 'guildIntegrationsUpdate'
    | 'guildMemberAdd'
    | 'guildMemberAvailable'
    | 'guildMemberRemove'
    | 'guildMembersChunk'
    | 'guildMemberSpeaking'
    | 'guildMemberUpdate'
    | 'guildUpdate'
    | 'inviteCreate'
    | 'inviteDelete'
    | 'message'
    | 'messageDelete'
    | 'messageReactionRemoveAll'
    | 'messageReactionRemoveEmoji'
    | 'messageDeleteBulk'
    | 'messageReactionAdd'
    | 'messageReactionRemove'
    | 'messageUpdate'
    | 'presenceUpdate'
    | 'rateLimit'
    | 'ready'
    | 'invalidated'
    | 'roleCreate'
    | 'roleDelete'
    | 'roleUpdate'
    | 'typingStart'
    | 'userUpdate'
    | 'voiceStateUpdate'
    | 'webhookUpdate'
    | 'shardDisconnect'
    | 'shardError'
    | 'shardReady'
    | 'shardReconnecting'
    | 'shardResume';
