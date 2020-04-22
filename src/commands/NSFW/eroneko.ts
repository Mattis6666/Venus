import { Message } from 'discord.js';
import { VenusCommand } from '../../interfaces/Client';
import { sendHentai } from '../../utils/nekos';

const callback = (message: Message, _args: string[]) => {
    return sendHentai(message, 'eroNeko');
};

export const command: VenusCommand = {
    name: 'eroneko',
    category: 'NSFW',
    aliases: ['ecchineko', 'eroticneko'],
    developerOnly: false,
    nsfw: true,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
