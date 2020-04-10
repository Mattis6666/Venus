import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import VenusClient from '../../interfaces/Client';
import { getGuild } from '../../database/mongo';
import { replace } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    const client = message.client as VenusClient;
    if (!message.guild) return;

    const prefix = args[0];
    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    guildSettings.settings.prefix = prefix;
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(
        replace(strings.SUCCESS, {
            PREFIX: prefix
        })
    );
};

export const command: Command = {
    name: 'setprefix',
    category: 'SETTINGS',
    aliases: ['prefix', 'setp'],
    description: 'Set the serverwide prefix for me',
    extended: '',
    usage: '<new prefix>',
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
