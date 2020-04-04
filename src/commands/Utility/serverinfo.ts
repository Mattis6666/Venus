import { Message } from 'discord.js';
import Command from '../../interfaces/Command';

const callback = (message: Message, args: string[]) => {
    args;
    message;
    return;
};

export const command: Command = {
    name: 'example',
    category: 'DEVELOPMENT',
    aliases: [],
    description: '',
    usage: '',
    developerOnly: true,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
