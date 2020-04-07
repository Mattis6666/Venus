import { Message } from 'discord.js';
import config from '../utils/config';
import { Guild } from '../database/schemas/GuildSchema';
import db from '../database/mongo';
import { wrongSyntax, handleError, nicerPermissions } from '../utils/Util';
import Client from '../interfaces/Client';
import { Languages } from '../interfaces/Languages';

export default async (VenusClient: Client, message: Message) => {
    if (message.author.bot || (message.guild && !message.member) || !message.client || !message.channel) return;

    const guildSettings: Guild | null = message.guild
        ? VenusClient.guildSettings.get(message.guild.id) || (await db.Guilds.findOne({ guildId: message.guild.id }))
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
        if (message.mentions.users?.has(VenusClient.user!.id) && message.guild)
            message.channel.send(`My prefix on this server is \`${guildPrefix}\`\nFor a list of commands, type \`${guildPrefix}help\``);
        return;
    }

    const command = VenusClient.commands.get(commandName) || VenusClient.commands.find(command => command.aliases.includes(commandName));
    if (!command || !command.callback) return;

    const language: Languages = guildSettings?.settings.language || 'en_GB';
    const strings = VenusClient.languages.get(language)?.find(cmd => cmd.command === command.name)?.strings;

    if (!config.developers.includes(message.author.id)) {
        if (command.developerOnly) return;
        if (message.guild && message.guild.me && message.channel.type === 'text') {
            if (guildSettings && guildSettings.settings.disabledCommands.includes(command.name)) return;
            if (command.userPermissions && message.member && !message.channel.permissionsFor(message.member)!.has(command.userPermissions))
                return wrongSyntax(message, `This command requires you to have the \`${nicerPermissions(command.userPermissions)}\` permission!`);
            if (command.botPermissions && !message.channel.permissionsFor(message.guild.me)!.has(command.botPermissions)) {
                return wrongSyntax(message, `I need the the \`${nicerPermissions(command.userPermissions)}\` permission to use this command!`);
            }
        }
    }
    if (command.guildOnly && !message.guild) return wrongSyntax(message, 'This command can only be used on a server!');
    if (command.dmOnly && message.guild) return wrongSyntax(message, 'This command can only be used in my DMs!');
    if (command.requiresArgs && args.length < command.requiresArgs)
        return wrongSyntax(
            message,
            `This command requires ${command.requiresArgs} arguments, but you ${args.length ? 'only provided ' + args.length : "didn't provide any"}!`
        );

    try {
        command.callback(message, args, strings!);
    } catch (err) {
        handleError(VenusClient, err);
    }
};
