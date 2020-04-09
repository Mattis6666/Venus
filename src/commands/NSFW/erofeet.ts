import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { sendHentai } from '../../utils/nekos';

const callback = (message: Message, _args: string[]) => {
    return sendHentai(message, 'eroFeet');
};

export const command: Command = {
    name: 'erofeet',
    category: 'NSFW',
    aliases: ['ecchifeet', 'eroticfeet'],
    description: 'ecchi feet - Only mildly NSFW',
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
