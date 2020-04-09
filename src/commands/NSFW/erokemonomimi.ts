import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { sendHentai } from '../../utils/nekos';

const callback = (message: Message, _args: string[]) => {
    return sendHentai(message, 'eroKemonomimi');
};

export const command: Command = {
    name: 'erokemonomimi',
    category: 'NSFW',
    aliases: ['erokemo', 'ecchikemo'],
    description: 'ecchi kemo - Only mildly NSFW',
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
