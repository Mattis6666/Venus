import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import VenClient from '../../interfaces/Client';
import { getGuild } from '../../database/mongo';

const callback = async (message: Message, args: string[]) => {
    const client = message.client as VenClient;
    if (!message.guild) return;

    const prefix = args[0];
    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    guildSettings.settings.prefix = prefix;
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(`This guild's prefix has successfully been changed to \`${prefix}\``);
};

export const command: Command = {
    name: 'setprefix',
    category: 'SETTINGS',
    aliases: ['prefix', 'setp'],
    description: 'Set the serverwide prefix for me',
    usage: '<new prefix>',
    developerOnly: false,
    requiresArgs: 1,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'ADMINISTRATOR',
    botPermissions: '',
    modOnly: false,
    adminOnly: true,
    callback: callback
};
