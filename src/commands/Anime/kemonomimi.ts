import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = (message: Message, args: string[]) => {
    return sendImage(message, args, 'kemonomimi', '{{USER}} shows you this cute kemonomimi, {{MEMBER}}!');
};

export const command: Command = {
    name: 'kemonomimi',
    category: 'ANIME',
    aliases: ['kemomimi', 'kemo', 'animalears'],
    description: 'Get a random kemonomimi image.',
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
