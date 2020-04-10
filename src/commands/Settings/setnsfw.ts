import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import VenusClient from '../../interfaces/Client';
import { getGuild } from '../../database/mongo';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, _args: string[], strings: CommandStrings) => {
    const client = message.client as VenusClient;
    if (!message.guild) return;

    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    const action = guildSettings.settings.nsfw ? false : true;
    guildSettings.settings.nsfw = action;
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(action ? strings.ENABLE : strings.DISABLE);
};

export const command: Command = {
    name: 'setnsfw',
    category: 'SETTINGS',
    aliases: ['nsfw', 'togglensfw'],
    description: 'Enable/Disable NSFW commands',
    extended: 'Even if enabled, NSFW commands can only be used in NSFW channels',
    usage: '',
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
