import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    return sendImage(message, args, 'neko', strings.MESSAGE);
};

export const command: Command = {
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
