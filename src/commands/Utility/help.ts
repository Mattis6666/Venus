import { Message, TextChannel } from 'discord.js';
import { VenusClient, VenusCommand, VenusCommandStrings, VenusCommandCategories } from '../../interfaces/Client';
import { wrongSyntax, newEmbed, replace, nicerPermissions } from '../../utils/Util';
import { getPrefix } from '../../utils/getters';
import { HelpCategories, HelpCommands } from '../../interfaces/HelpCategories';
import { getGuild } from '../../database';
import { emojis } from '../../constants/emojis';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    const client = message.client as VenusClient;
    const prefix = message.guild ? await getPrefix(client, message.guild.id) : client.config.defaultPrefix;
    const output = newEmbed(true);
    const guildSettings = message.guild ? await getGuild(message.guild.id) : null;
    const helpStrings = client.languages.get(guildSettings?.settings.language || 'en_GB');
    const input = args[0]?.toLowerCase();
    if (!helpStrings) return;

    const commands: HelpCommands = {
        DEVELOPMENT: [],
        MODERATION: [],
        SETTINGS: [],
        UTILITY: [],
        FUN: [],
        ANIME: [],
        NSFW: [],
        MISC: []
    };
    const categories: HelpCategories = {
        DEVELOPMENT: '',
        MODERATION: '',
        SETTINGS: '',
        UTILITY: '',
        FUN: '',
        ANIME: '',
        NSFW: '',
        MISC: ''
    };

    Object.keys(commands).forEach(key => {
        const command = client.commands.find(cmd => cmd.category === key);
        if (!command) return;
        const info = helpStrings.find(cmd => cmd.command === command.name)?.strings;
        if (!info) return;
        categories[key as VenusCommandCategories] = info.category;
    });

    if (
        Object.keys(categories).includes(args[0]?.toUpperCase()) ||
        Object.values(categories)
            .map(v => v.toLowerCase())
            .includes(input)
    ) {
        let category =
            Object.keys(categories)
                .find(c => categories[c as VenusCommandCategories]?.toLowerCase() === input)
                ?.toUpperCase() || args[0].toUpperCase();
        if (category === 'NSFW' && (!message.guild || !guildSettings || !guildSettings.settings.nsfw || !(message.channel as TextChannel).nsfw))
            return wrongSyntax(message, strings.VIEW_NSFW_COMMAND);

        const commands: string[] = [];
        client.commands
            .filter(cmd => cmd.category === category)
            .forEach(cmd => {
                const info = helpStrings.find(str => str.command === cmd.name)?.strings;
                if (!info) return;
                category = info.category;
                commands.push(`\`${prefix}${cmd.name}\` - *${info.description}*`);
            });
        output
            .setTitle(`${category} ${strings.HEADER}`)
            .setFooter(
                replace(strings.FOOTER, {
                    PREFIX: prefix
                })
            )
            .setDescription(commands.join('\n'));
        return message.channel.send(output);
    }

    if (!args.length) {
        client.commands.forEach(command => {
            const category = commands[command.category];
            if (!category) return;
            const info = helpStrings.find(cmd => cmd.command === command.name)?.strings;
            if (!info) return;
            category.push(command.name);
        });

        output
            .setTitle(strings.HEADER)
            .setDescription(
                replace(strings.MENU_DESCRIPTION, {
                    PREFIX: prefix
                })
            )
            .addFields([
                { name: categories.MODERATION, value: commands.MODERATION.join(', ') },
                { name: categories.SETTINGS, value: commands.SETTINGS.join(', ') },
                { name: categories.UTILITY, value: commands.UTILITY.join(', ') },
                { name: categories.FUN, value: commands.FUN.join(', ') },
                { name: categories.ANIME, value: commands.ANIME.join(', ') },
                {
                    name: 'NSFW',
                    value: replace(strings.VIEW_NSFW_MENU, {
                        PREFIX: prefix
                    })
                }
            ]);
        return message.channel.send(output);
    }

    const name = args[0].toLowerCase();
    const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
    if (!command) return wrongSyntax(message, strings.INVALID);

    const info = helpStrings.find(cmd => cmd.command === command.name)?.strings;
    if (!info) return;

    if (command.developerOnly && !client.config.developers.includes(message.author.id)) return;
    if (command.nsfw && (!message.guild || !guildSettings || !guildSettings.settings.nsfw || !(message.channel as TextChannel).nsfw))
        return wrongSyntax(message, strings.VIEW_NSFW_COMMAND);

    output
        .setAuthor(prefix + command.name)
        .setDescription(
            `${strings.GUILD_ONLY}: ${emoji(command.guildOnly)}\n${strings.NSFW}: ${emoji(command.nsfw)}\n${strings.REQUIRES_ARGS}: ${
                command.requiresArgs || emojis.fail
            }\n${strings.REQUIRES_PERMISSION}: ${command.userPermissions ? '`' + nicerPermissions(command.userPermissions) + '`' : emojis.fail}`
        )
        .addFields([
            { name: strings.DESCRIPTION, value: info.description + (info.extended ? '\n\n' + info.extended : '') || '-' },
            { name: strings.USAGE, value: '```' + `${prefix + command.name} ${info.usage || ''}` + '```' },
            { name: strings.ALIASES, value: command.aliases.join(', ') || '-' }
        ]);
    return message.channel.send(output);
};

export const command: VenusCommand = {
    name: 'help',
    category: 'UTILITY',
    aliases: ['h', 'commands', 'getstarted'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};

const emoji = (bool: boolean) => (bool ? emojis.success : emojis.fail);
