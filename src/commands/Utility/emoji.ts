import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { wrongSyntax } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = (message: Message, args: string[], strings: CommandStrings) => {
    const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/g;
    const emotes = args.join(' ').match(regex);
    if (!emotes) return wrongSyntax(message, strings.NO_EMOJIS);

    const emoteLinks = emotes.map(
        e => `<https://cdn.discordapp.com/emojis/${e.slice(e.lastIndexOf(':') + 1, e.lastIndexOf('>'))}${e.startsWith('<a') ? '.gif' : '.png'}>`
    );
    return message.channel.send(emoteLinks.join('\n'));
};

export const command: Command = {
    name: 'emoji',
    category: 'UTILITY',
    aliases: ['emote', 'e'],
    description: 'Get the link of any emoji',
    extended: '',
    usage: '<emoji> (you can add as many as you wish)',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
