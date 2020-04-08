import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { fact } from '../../utils/nekos';

const callback = async (message: Message, _args: string[]) => {
    const result = await fact();
    return message.channel.send(`${result}, ${message.author.username}`);
};

export const command: Command = {
    name: 'fact',
    category: 'FUN',
    aliases: ['randomfact', 'trivia', 'randomtrivia'],
    description: 'Get a random fact.',
    extended: '',
    usage: '',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
