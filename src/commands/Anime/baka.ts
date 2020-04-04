import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = async (message: Message, args: string[]) => {
    return sendImage(message, args, 'baka', '{{USER}} finds you baka, {{MEMBER}}!');
};

export const command: Command = {
    name: 'baka',
    category: 'ANIME',
    aliases: [],
    description: 'Get a random baka image.',
    extended: 'If your friend is baka, pass along their name or mention!',
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
