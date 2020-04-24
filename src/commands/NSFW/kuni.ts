import { VenusCommand, VenusMessage } from '../../interfaces/Client';
import { sendHentai } from '../../utils/nekos';

const callback = async (message: VenusMessage, _args: string[]) => {
    return sendHentai(message, 'kuni');
};

export const command: VenusCommand = {
    name: 'kuni',
    category: 'NSFW',
    aliases: [],
    developerOnly: false,
    nsfw: true,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
