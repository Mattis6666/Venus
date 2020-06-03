import { Collection, Client, PermissionString, Message, ClientOptions, TextChannel, DMChannel, MessageEmbed, NewsChannel, GuildMember } from 'discord.js';
import { database } from '../database';
import { config } from '../config';

const clientOptions: ClientOptions = {
    disableMentions: 'everyone',
    presence: {
        activity: {
            name: `${config.defaultPrefix}help`,
            type: 'LISTENING',
            url: 'https://www.twitch.tv/.'
        }
    },
    partials: ['MESSAGE', 'REACTION']
};

export class VenusClient extends Client {
    constructor() {
        super(clientOptions);
    }
    commands: Collection<string, VenusCommand> = new Collection();
    prompts: Collection<string, string> = new Collection();
    inhibitors: Collection<string, (message: VenusMessage, command: VenusCommand) => boolean> = new Collection(); // TODO
    // TODO cooldowns: Collection<string, string> = new Collection();
    languages: Collection<string, VenusStrings[]> = new Collection();
    config = config;
    database = database;
    async getPrefix(guildThing: VenusMessage | GuildMember) {
        return (await this.getSettings(guildThing))?.settings.prefix || this.config.defaultPrefix;
    }
    async getSettings(guildThing: VenusMessage | GuildMember) {
        return guildThing.guild
            ? (await this.database.guildSettings.findOne({ guild: guildThing.guild.id })) ||
                  (await this.database.guildSettings.create({ guild: guildThing.guild.id }))
            : null;
    }
    checkPermissions(channel: TextChannel | DMChannel | NewsChannel, Permissions: PermissionString[] = ['SEND_MESSAGES', 'EMBED_LINKS', 'VIEW_CHANNEL']) {
        if (channel instanceof DMChannel) return true;
        if (channel.permissionsFor(channel.guild.me!)?.has(Permissions)) return true;
        return false;
    }
    embed(message: VenusMessage) {
        return new MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp()
            .setAuthor(message.member?.displayName || message.author.username, message.author.displayAvatarURL({ size: 256, dynamic: true }));
    }
}

export interface VenusMessage extends Message {
    client: VenusClient;
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
    cooldown?: number;
    userPermissions: PermissionString | '';
    botPermissions: PermissionString | '';
    callback(message: VenusMessage, args: string[], language: VenusCommandStrings): Promise<Message | void>;
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

export type VenusLanguages = 'en_GB' | 'de_DE' | 'nl_NL' | 'tr_TR' | 'fr_FR';

export type VenusCommandCategories = 'DEVELOPMENT' | 'MODERATION' | 'SETTINGS' | 'UTILITY' | 'MISC' | 'FUN' | 'ANIME' | 'NSFW';

export type ClientEventTypes =
    | 'commandUsed'
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
