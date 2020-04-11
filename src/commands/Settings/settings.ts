import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';
import { getGuild } from '../../database/mongo';
import { newEmbed } from '../../utils/Util';

const callback = async (message: Message, _args: string[], strings: CommandStrings) => {
    if (!message.guild) return;
    const guildSettings = await getGuild(message.guild.id);
    const settingsEmbed = newEmbed(true);
    return;
    guildSettings;
    settingsEmbed;
    strings;
};

export const command: Command = {
    name: 'settings',
    category: 'SETTINGS',
    aliases: ['viewsettings', 'showsettings', 's'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
