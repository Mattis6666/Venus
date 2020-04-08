import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { sendHentai } from '../../utils/nekos';

const callback = (message: Message, _args: string[]) => {
    return sendHentai(message, 'futanari');
};

export const command: Command = {
    name: 'futanari',
    category: 'NSFW',
    aliases: [],
    description: '',
    extended: '',
    usage: '',
    developerOnly: false,
    nsfw: true,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
