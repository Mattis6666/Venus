import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { resetGuild } from '../../database/mongo';
import { wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, _args: string[]) => {
    if (!message.guild) return;

    const guild = await resetGuild(message.guild.id);
    if (!guild) return wrongSyntax(message, `I was unable to find a database entry for ${message.guild.name}`);

    return message.channel.send(`Successfully reset this guild's settings!`);
};

export const command: Command = {
    name: 'resetserver',
    category: 'SETTINGS',
    aliases: [],
    description: `Resets all my settings`,
    extended: 'THIS WILL RESET ALL MY SETTINGS! This includes prefix, disabled commands, blocked channels, the welcome channel...',
    usage: '',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'ADMINISTRATOR',
    botPermissions: '',
    callback: callback
};
