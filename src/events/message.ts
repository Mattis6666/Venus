import { Message } from 'discord.js';
import config from '../utils/config';
import { Guild } from '../database/schemas/GuildSchema';
import db from '../database/mongo';
import { wrongSyntax, handleError, nicerPermissions } from '../utils/Util';
import Client from '../interfaces/Client';

export default async (VenClient: Client, message: Message) => {
    if (message.author.bot || !message.author || (message.guild && !message.member) || !message.client || !message.channel) return;

    const guildSettings: Guild | null = message.guild
        ? VenClient.guildSettings.get(message.guild.id) || (await db.findOne({ guildId: message.guild.id }))
        : null;
    if (message.guild && guildSettings && !VenClient.guildSettings.has(message.guild.id)) {
        VenClient.guildSettings.set(message.guild.id, guildSettings);
    }
    const guildPrefix = guildSettings?.settings.prefix;
    const prefixRegex = new RegExp(`^(<@!?${VenClient.user?.id}>|${(guildPrefix || config.defaultPrefix).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const matched = message.content.match(prefixRegex);
    const prefix = matched ? matched[0] : null;
    if (!prefix || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = VenClient.commands.get(commandName) || VenClient.commands.find(command => command.aliases.includes(commandName));
    if (!command || !command.callback) return;

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
        command.callback(message, args);
    } catch (err) {
        handleError(VenClient, err);
    }
};
