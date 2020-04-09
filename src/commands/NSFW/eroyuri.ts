import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { sendHentai } from '../../utils/nekos';

const callback = (message: Message, _args: string[]) => {
    return sendHentai(message, 'eroYuri');
};

export const command: Command = {
    name: 'eroyuri',
    category: 'NSFW',
    aliases: ['ecchiyuri', 'eroticyuri'],
    description: 'ecchi yuri - Only mildly NSFW',
    extended: 'Source: nekos.life',
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
