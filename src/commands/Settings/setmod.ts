import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import VenusClient from '../../interfaces/Client';
import { getGuild } from '../../database/mongo';

const callback = async (message: Message, args: string[]) => {
    const client = message.client as VenusClient;
    if (!message.guild) return;

    const prefix = args[0];
    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    guildSettings.settings.prefix = prefix;
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(`This guild's prefix has successfully been changed to \`${prefix}`);
};

export const command: Command = {
    name: 'setmod',
    category: 'SETTINGS',
    aliases: ['setmoderator', 'moderator', 'mod'],
    description: 'Give a user or role moderator permissions on me',
    extended: '',
    usage: '<user (mention, username or ID) | role (mention, username or ID)>',
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'ADMINISTRATOR',
    botPermissions: '',
    modOnly: false,
    adminOnly: true,
    callback: callback
};
