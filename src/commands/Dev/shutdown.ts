import { Message } from 'discord.js';
import Command from '../../interfaces/Command';

const callback = async (message: Message, _args: string[]) => {
    await message.channel.send('Okay, shutting down!');
    process.exit();
};

export const command: Command = {
    name: 'shutdown',
    category: 'DEVELOPMENT',
    aliases: ['die', 'kys'],
    description: '',
    extended: '',
    usage: '',
    developerOnly: true,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
