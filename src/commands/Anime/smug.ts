import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    return sendImage(message, args, 'smug', strings.MESSAGE);
};

export const command: Command = {
    name: 'smug',
    category: 'ANIME',
    aliases: ['proud', 'grin'],
    description: 'Get a random smug image.',
    extended: 'To give your friend a smug look, pass along their name or mention!',
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
