import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = (message: Message, args: string[]) => {
    return sendImage(message, args, 'kiss', '{{USER}} kisses {{MEMBER}}!');
};

export const command: Command = {
    name: 'kiss',
    category: 'ANIME',
    aliases: [],
    description: 'Get a random kiss image.',
    extended: 'To kiss your friend, pass along their name or mention!',
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
