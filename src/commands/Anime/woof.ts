import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = (message: Message, args: string[]) => {
    return sendImage(message, args, 'woof', '{{USER}} shows you this cute doggo, {{MEMBER}}!');
};

export const command: Command = {
    name: 'woof',
    category: 'ANIME',
    aliases: ['doggo', 'dog'],
    description: 'Get a random woof image.',
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
