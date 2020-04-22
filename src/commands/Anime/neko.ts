import { sendImage } from '../../utils/nekos';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { Message } from 'discord.js';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    return sendImage(message, args, 'neko', strings.MESSAGE);
};

export const command: VenusCommand = {
    name: 'neko',
    category: 'ANIME',
    aliases: [],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
