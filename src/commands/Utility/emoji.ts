import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { wrongSyntax } from '../../utils/Util';

const callback = (message: Message, args: string[]) => {
    const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/g;
    const emotes = args.join(' ').match(regex);
    if (!emotes) return wrongSyntax(message, 'You did not provide any emotes!');

    const emoteLinks = emotes.map(
        e => `<https://cdn.discordapp.com/emojis/${e.slice(e.lastIndexOf(':') + 1, e.lastIndexOf('>'))}${e.startsWith('<a') ? '.gif' : '.png'}>`
    );
    return message.channel.send(emoteLinks.join('\n'));
};

export const command: Command = {
    name: 'emote',
    category: 'UTILITY',
    aliases: ['emoji'],
    description: 'Get the link of any emote',
    usage: '<emoji> (you can add as many as you wish)',
    developerOnly: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
