import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings, VenusClient } from '../../interfaces/Client';
import { getGuild } from '../../database';
import { replace, wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    const client = message.client as VenusClient;

    const guildSettings = await getGuild(message.guild!.id);
    if (!args.length) {
        guildSettings.channels.introChannel = '';
        client.guildSettings.set(message.guild!.id, guildSettings);
        await guildSettings.save();
        return message.channel.send(strings.RESET);
    }
    const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[0]);
    if (!channel) return wrongSyntax(message, strings.NO_CHANNEL);
    if (channel.type !== 'text') return wrongSyntax(message, strings.VERY_FUNNY);

    guildSettings.channels.introChannel = channel.id;
    client.guildSettings.set(message.guild!.id, guildSettings);
    await guildSettings.save();

    return message.channel.send(
        replace(strings.SUCCESS, {
            CHANNEL: channel.name
        })
    );
};

export const command: VenusCommand = {
    name: 'setintrochannel',
    category: 'SETTINGS',
    aliases: ['introchannel', 'setintros', 'intros'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
