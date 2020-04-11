import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { sendHentai } from '../../utils/nekos';

const callback = (message: Message, _args: string[]) => {
    return sendHentai(message, 'eroKitsune');
};

export const command: Command = {
    name: 'erokitsune',
    category: 'NSFW',
    aliases: ['ecchikitsune', 'erotickitsune'],
    developerOnly: false,
    nsfw: true,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
