import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed, nicerDates, replace } from '../../utils/Util';
import { emojis } from '../../constants/emojis';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, _args: string[], strings: CommandStrings) => {
    const guild = message.guild;
    if (!guild) return;

    const guildInfo = [
        {
            name: emojis.crown,
            value: guild.members.cache.get(guild.ownerID) || (await guild.members.fetch(guild.ownerID))
        },
        {
            name: emojis.hash,
            value: guild.id
        },
        {
            name: emojis.globe,
            value: guild.region
        },
        {
            name: emojis.date,
            value: nicerDates(guild.createdAt)
        },
        {
            name: emojis.info,
            value: guild.description || strings.NO_DESCRIPTION
        },
        {
            name: emojis.member,
            value: guild.memberCount
        },
        {
            name: emojis.smiley,
            value: guild.emojis.cache.size
        },
        {
            name: emojis.nitroBoost,
            value: `${guild.premiumSubscriptionCount} (${replace(strings.BOOST_LEVEL, {
                LEVEL: guild.premiumTier.toString()
            })})`
        }
    ];
    const roles = guild.roles.cache.filter(r => r.id !== guild.id).array(),
        channels = guild.channels.cache.filter(c => c.type === 'text').array();

    const output = newEmbed(true)
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({ size: 2048, dynamic: true })!)
        .setImage((guild.splashURL({ size: 2048 }) || guild.bannerURL({ size: 2048 }))!)
        .setDescription(guildInfo.map(info => `${info.name} ${info.value}`))
        .addFields([
            {
                name: `${strings.ROLES} (${roles.length})`,
                value: roles.join(' ').length < 1025 ? roles.join(' ') : strings.TOO_MANY_ROLES
            },
            {
                name: `${strings.CHANNELS} (${channels.length})`,
                value: channels.join(' ').length < 1025 ? channels.join(' ') : strings.TOO_MANY_CHANNELS
            }
        ]);

    return message.channel.send(output);
};

export const command: Command = {
    name: 'serverinfo',
    category: 'UTILITY',
    aliases: ['si', 'server', 'guildinfo', 'gi'],
    description: 'Display a lot of info about the server.',
    extended: '',
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
