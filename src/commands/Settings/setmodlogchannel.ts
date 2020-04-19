import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';
import { getGuild } from '../../database/mongo';
import VenusClient from '../../interfaces/Client';
import { replace, wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    const client = message.client as VenusClient;

    const guildSettings = await getGuild(message.guild!.id);
    if (!args.length) {
        guildSettings.channels.modLogChannel = '';
        client.guildSettings.set(message.guild!.id, guildSettings);
        await guildSettings.save();
        return message.channel.send(strings.RESET);
    }
    const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[0]);
    if (!channel) return wrongSyntax(message, strings.NO_CHANNEL);
    if (channel.type !== 'text') return wrongSyntax(message, strings.VERY_FUNNY);

    guildSettings.channels.modLogChannel = channel.id;
    client.guildSettings.set(message.guild!.id, guildSettings);
    await guildSettings.save();

    return message.channel.send(
        replace(strings.SUCCESS, {
            CHANNEL: channel.name
        })
    );
};

export const command: Command = {
    name: 'setmodlogchannel',
    category: 'SETTINGS',
    aliases: ['modlogchannel', 'mlchannel'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
