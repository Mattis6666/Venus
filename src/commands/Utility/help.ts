import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import VenusClient from '../../interfaces/Client';
import config from '../../utils/config';
import { wrongSyntax, newEmbed } from '../../utils/Util';
import { getPrefix } from '../../utils/getters';
import { HelpCategories } from '../../interfaces/HelpCategories';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], _language: CommandStrings) => {
    const client = message.client as VenusClient;
    const prefix = message.guild ? await getPrefix(client, message.guild.id) : config.defaultPrefix;
    const output = newEmbed(true);
    if (!args.length) {
        const commands: HelpCategories = {
            DEVELOPMENT: [],
            MODERATION: [],
            SETTINGS: [],
            UTILITY: [],
            FUN: [],
            ANIME: [],
            NSFW: [],
            MISC: []
        };
        client.commands.forEach(command => {
            const category = commands[command.category];
            if (!category) return;
            category.push(`\`${prefix}${command.name}\` - *${command.description}*`);
        });
        output
            .setTitle('Help Menu')
            .setAuthor("Here's a list of all available commands!")
            .setFooter(`Type ${prefix}help [command name] to get info on a specific command`)
            .addFields([
                { name: 'Moderation', value: commands.MODERATION.join('\n') },
                { name: 'Settings', value: commands.SETTINGS.join('\n') },
                { name: 'Utility', value: commands.UTILITY.join('\n') },
                { name: 'Fun', value: commands.FUN.join('\n') },
                { name: 'Anime', value: commands.ANIME.join('\n') }
            ]);
        return message.channel.send(output);
    }

    const name = args[0].toLowerCase();
    const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
    if (!command) return wrongSyntax(message, "That's not a valid command!");
    if (command.developerOnly && !config.developers.includes(message.author.id)) return;

    output.setAuthor(command.name.toUpperCase()).addFields([
        { name: 'Description', value: command.description || '-' },
        { name: 'Usage', value: `\`${prefix + command.name} ${command.usage || ''}\``, inline: true },
        { name: 'Aliases', value: command.aliases.join(', ') || '-', inline: true }
    ]);
    return message.channel.send(output);
};

export const command: Command = {
    name: 'help',
    category: 'UTILITY',
    aliases: ['h', 'commands', 'getstarted'],
    description: 'You are here d-(O.O)-b',
    extended: '',
    usage: '[command name | command alias]',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
