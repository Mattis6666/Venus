import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = (message: Message, args: string[]) => {
    return sendImage(message, args, 'meow', '{{USER}} shows you this cute cat, {{MEMBER}}!');
};

export const command: Command = {
    name: 'meow',
    category: 'ANIME',
    aliases: ['cat', 'kitten', 'kitty'],
    description: 'Get a random meow image.',
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
