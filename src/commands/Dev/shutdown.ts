import { VenusCommand, VenusMessage } from '../../interfaces/Client';

const callback = async (message: VenusMessage, _args: string[]) => {
    await message.channel.send('Okay, shutting down!');
    process.exit();
};

export const command: VenusCommand = {
    name: 'shutdown',
    category: 'DEVELOPMENT',
    aliases: ['die', 'kys'],
    developerOnly: true,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
