import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = (message: Message, args: string[]) => {
    return sendImage(message, args, 'slap', '{{USER}} slaps {{MEMBER}}!');
};

export const command: Command = {
    name: 'slap',
    category: 'ANIME',
    aliases: ['whack', 'bash'],
    description: 'Get a random slap image.',
    extended: 'To slap your friend, pass along their name or mention!',
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
