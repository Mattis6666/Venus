import { OwOify } from '../../utils/nekos';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { Message } from 'discord.js';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    const owo = await OwOify(args.join(' '));
    if (!owo) return wrongSyntax(message, strings.FAILURE);
    return message.channel.send(
        `*${replace(strings.SUCCESS, {
            USER: message.author.username
        })}:*\n>>> ${owo}`
    );
};

export const command: VenusCommand = {
    name: 'owoify',
    category: 'ANIME',
    aliases: ['owo', 'uwuify', 'uwu'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
