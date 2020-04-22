import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { wrongSyntax } from '../../utils/Util';
import { emoteRegex } from '../../constants/regex';

const callback = (message: Message, args: string[], strings: VenusCommandStrings) => {
    const emotes = args.join(' ').match(emoteRegex);
    if (!emotes) return wrongSyntax(message, strings.NO_EMOJIS);

    const emoteLinks = emotes.map(
        e => `<https://cdn.discordapp.com/emojis/${e.slice(e.lastIndexOf(':') + 1, e.lastIndexOf('>'))}${e.startsWith('<a') ? '.gif' : '.png'}>`
    );
    return message.channel.send(emoteLinks.join('\n'));
};

export const command: VenusCommand = {
    name: 'emoji',
    category: 'UTILITY',
    aliases: ['emote', 'e'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
