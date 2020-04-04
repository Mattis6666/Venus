import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';

const callback = (message: Message, args: string[]) => {
    return sendImage(message, args, 'poke', '{{USER}} pokes {{MEMBER}}!');
};

export const command: Command = {
    name: 'poke',
    category: 'ANIME',
    aliases: [],
    description: 'Get a random poke image.',
    extended: 'To poke your friend, pass along their name or mention!',
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
