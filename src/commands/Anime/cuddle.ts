import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = async (message: Message, args: string[]) => {
    return sendImage(message, args, 'cuddle', '{{USER}} cuddles {{MEMBER}}!');
};

export const command: Command = {
    name: 'cuddle',
    category: 'ANIME',
    aliases: [],
    description: 'Get a random cuddle image.',
    extended: 'To cuddle your friend, pass along their name or mention!',
    usage: '[user]',
    developerOnly: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
