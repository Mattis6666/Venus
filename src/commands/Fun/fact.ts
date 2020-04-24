import { VenusCommand, VenusMessage } from '../../interfaces/Client';
import { fact } from '../../utils/nekos';

const callback = async (message: VenusMessage, _args: string[]) => {
    const result = await fact();
    return message.channel.send(`${result}, ${message.author.username}`);
};

export const command: VenusCommand = {
    name: 'fact',
    category: 'FUN',
    aliases: ['randomfact', 'trivia', 'randomtrivia'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
