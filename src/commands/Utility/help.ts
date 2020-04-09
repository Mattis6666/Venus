import { Message, TextChannel } from 'discord.js';
import Command from '../../interfaces/Command';
import VenusClient from '../../interfaces/Client';
import config from '../../utils/config';
import { wrongSyntax, newEmbed } from '../../utils/Util';
import { getPrefix } from '../../utils/getters';
import { HelpCategories } from '../../interfaces/HelpCategories';
import CommandStrings from '../../interfaces/CommandStrings';
import { getGuild } from '../../database/mongo';

const callback = async (message: Message, args: string[], _language: CommandStrings) => {
    const client = message.client as VenusClient;
    const prefix = message.guild ? await getPrefix(client, message.guild.id) : config.defaultPrefix;
    const output = newEmbed(true);
    const guildSettings = message.guild ? await getGuild(message.guild.id) : null;
    if (args[0]?.toLowerCase() === 'nsfw') {
        if (!message.guild || !guildSettings || !guildSettings.settings.nsfw || !(message.channel as TextChannel).nsfw)
            return wrongSyntax(message, 'To view this, make sure the server has NSFW enabled and run the command in a NSFW channel!');
        output
            .setTitle('NSFW Help menu')
            .setAuthor("Here's a list of all available commands!")
            .setFooter(`Type ${prefix}help [command name] to get info on a specific command`)
            .setDescription(client.commands.filter(cmd => cmd.category === 'NSFW').map(cmd => `\`${prefix}${cmd.name}\` - *${cmd.description}*`));
        return message.channel.send(output);
    }
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
                { name: 'Anime', value: commands.ANIME.join('\n') },
                { name: 'NSFW', value: `To view these, run \`${prefix}help nsfw\` in a NSFW channel!` }
            ]);
        return message.channel.send(output);
    }

    const name = args[0].toLowerCase();
    const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
    if (!command) return wrongSyntax(message, "That's not a valid command!");
    if (command.developerOnly && !config.developers.includes(message.author.id)) return;
    if (command.nsfw && (!message.guild || !guildSettings || !guildSettings.settings.nsfw || !(message.channel as TextChannel).nsfw))
        return wrongSyntax(message, 'To view this, make sure the server has NSFW enabled and run the command in a NSFW channel!');

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
