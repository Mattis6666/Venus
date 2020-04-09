import { sendImage } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    return sendImage(message, args, 'slap', strings.MESSAGE);
};

export const command: Command = {
    name: 'slap',
    category: 'ANIME',
    aliases: ['whack', 'bash'],
    description: 'Get a random slap image.',
    extended: 'To slap your friend, pass along their name or mention!',
    usage: '[user]',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
