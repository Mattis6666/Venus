import { OwOify } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';
import CommandStrings from '../../interfaces/CommandStrings';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    const owo = await OwOify(args.join(' '));
    if (!owo) return wrongSyntax(message, strings.FAILURE);
    return message.channel.send(
        `*${replace(strings.SUCCESS, {
            USER: message.author.username
        })}:*\n>>> ${owo}`
    );
};

export const command: Command = {
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
