import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = (message: Message, args: string[]) => {
    return sendImage(message, args, 'nekoGif', '{{USER}} shows you this cute neko, {{MEMBER}}!');
};

export const command: Command = {
    name: 'nekogif',
    category: 'ANIME',
    aliases: ['ngif', 'nekog'],
    description: 'Get a random neko gif.',
    extended: '',
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
