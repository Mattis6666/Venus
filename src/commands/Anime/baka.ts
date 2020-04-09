import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    return sendImage(message, args, 'baka', strings.MESSAGE);
};

export const command: Command = {
    name: 'baka',
    category: 'ANIME',
    aliases: [],
    description: 'Get a random baka image.',
    extended: 'If your friend is baka, pass along their name or mention!',
    usage: '[user]',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
