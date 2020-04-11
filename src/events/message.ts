import { Message } from 'discord.js';
import config from '../utils/config';
import { Guild } from '../database/schemas/GuildSchema';
import db from '../database/mongo';
import { wrongSyntax, handleError, nicerPermissions, replace } from '../utils/Util';
import Client from '../interfaces/Client';
import { Languages } from '../interfaces/Languages';

export default async (VenusClient: Client, message: Message) => {
    if (message.author.bot || (message.guild && !message.member) || !message.client || !message.channel) return;
    if (
        message.channel.type === 'text' &&
        message.guild &&
        (!message.channel.permissionsFor(message.guild.me!)?.has('VIEW_CHANNEL') || !message.channel.permissionsFor(message.guild.me!)?.has('SEND_MESSAGES'))
    )
        return;

    const guildSettings: Guild | null = message.guild
        ? VenusClient.guildSettings.get(message.guild.id) || (await db.Guilds.findOne({ guild: message.guild.id }))
        : null;
    if (message.guild && guildSettings && !VenusClient.guildSettings.has(message.guild.id)) {
        VenusClient.guildSettings.set(message.guild.id, guildSettings);
    }
    const guildPrefix = guildSettings?.settings.prefix || config.defaultPrefix;

    const prefixRegex = new RegExp(`^(<@!?${VenusClient.user?.id}>|${guildPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const matched = message.content.match(prefixRegex);
    const prefix = matched ? matched[0] : null;
    if (!prefix || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) {
        if (message.mentions.users?.has(VenusClient.user!.id) && message.guild) {
            const misc = VenusClient.languages.get(guildSettings?.settings.language || 'en_GB')?.find(str => str.command === 'misc')?.strings;
            if (misc)
                message.channel.send(
                    replace(misc.PREFIX, {
                        PREFIX: guildPrefix
                    })
                );
        }
        return;
    }

    const command = VenusClient.commands.get(commandName) || VenusClient.commands.find(command => command.aliases.includes(commandName));
    if (!command || !command.callback) return;

    const language: Languages = guildSettings?.settings.language || 'en_GB';
    const strings = VenusClient.languages.get(language) || VenusClient.languages.get('en_GB');
    if (!strings) throw new Error('NO STRINGS - INDEX - ' + language);

    const errors = strings.find(str => str.command === 'errors')?.strings || VenusClient.languages.get('en_GB')?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - INDEX - ' + language);

    const commandStrings =
        strings.find(str => str.command === command.name)?.strings || VenusClient.languages.get('en_GB')?.find(str => str.command === command.name)?.strings;
    if (!commandStrings && !['DEVELOPMENT', 'NSFW'].includes(command.category)) throw new Error('NO COMMAND STRINGS - INDEX - ' + language);

    if (!config.developers.includes(message.author.id)) {
        if (command.developerOnly) return;
        if (message.guild && message.guild.me && message.channel.type === 'text') {
            if (guildSettings && guildSettings.settings.disabledCommands.includes(command.name)) return;
            if (command.userPermissions && message.member && !message.channel.permissionsFor(message.member)!.has(command.userPermissions))
                return wrongSyntax(
                    message,
                    replace(errors.USER_MISSING_PERMISSION, {
                        PERMISSION: nicerPermissions(command.userPermissions)
                    })
                );
            if (command.botPermissions && !message.channel.permissionsFor(message.guild.me)!.has(command.botPermissions))
                return wrongSyntax(
                    message,
                    replace(errors.BOT_MISSING_PERMISSION, {
                        PERMISSION: nicerPermissions(command.botPermissions)
                    })
                );
        }
    }
    if (command.guildOnly && !message.guild) return wrongSyntax(message, errors.SERVER_ONLY);
    if (command.dmOnly && message.guild) return wrongSyntax(message, errors.DM_ONLY);
    if (command.nsfw && (!message.guild || message.channel.type !== 'text' || !message.channel.nsfw)) return wrongSyntax(message, errors.NSFW_CHANNEL_ONLY);
    if (command.nsfw && (!guildSettings || !guildSettings.settings.nsfw)) return wrongSyntax(message, errors.NSFW_DISABLED);
    if (command.requiresArgs && args.length < command.requiresArgs)
        return wrongSyntax(
            message,
            replace(errors.WRONG_USAGE, {
                USAGE: `${prefix}${command.name} ${commandStrings!.usage}`
            })
        );

    try {
        command.callback(message, args, commandStrings!);
    } catch (err) {
        handleError(VenusClient, err);
    }
};
