import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = (message: Message, args: string[], strings: CommandStrings) => {
    return;
    message;
    args;
    strings;
};

export const command: Command = {
    name: 'settings',
    category: 'SETTINGS',
    aliases: ['viewsettings', 'botsettings'],
    description: 'Displays all bot settings',
    extended: 'To reset all settings, use the reset command!',
    usage: '',
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
