import { VenusCommand, VenusMessage } from '../../interfaces/Client';

const callback = async (message: VenusMessage, _args: string[]) => {
    const msg = await message.channel.send('Pinging...');
    return msg.edit(`🏓 Pong! \`${msg.createdTimestamp - message.createdTimestamp}ms\``);
};

export const command: VenusCommand = {
    name: 'ping',
    category: 'UTILITY',
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
