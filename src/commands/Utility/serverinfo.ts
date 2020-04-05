import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed, nicerDates } from '../../utils/Util';
import { emojis } from '../../constants/emojis';

const callback = async (message: Message, _args: string[]) => {
    const guild = message.guild;
    if (!guild) return;

    const guildInfo = [
        {
            name: `${emojis.crown}`,
            value: guild.members.cache.get(guild.ownerID) || (await guild.members.fetch(guild.ownerID))
        },
        {
            name: `${emojis.hash}`,
            value: guild.id
        },
        {
            name: `${emojis.globe}`,
            value: guild.region
        },
        {
            name: `${emojis.date}`,
            value: nicerDates(guild.createdAt)
        },
        {
            name: `${emojis.info}`,
            value: guild.description || 'No description provided'
        },
        {
            name: `${emojis.member}`,
            value: guild.memberCount
        },
        {
            name: `${emojis.smiley}`,
            value: guild.emojis.cache.size
        },
        {
            name: `${emojis.nitroBoost}`,
            value: `${guild.premiumSubscriptionCount} (Level ${guild.premiumTier})`
        }
    ];
    const roles = guild.roles.cache.filter(r => r.id !== guild.id).array(),
        channels = guild.channels.cache.filter(c => c.type === 'text').array();

    const output = newEmbed(true)
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({ size: 2048, dynamic: true })!)
        .setImage(guild.bannerURL({ size: 2048 })!)
        .setDescription(guildInfo.map(info => `${info.name} ${info.value}`))
        .addFields([
            {
                name: `Roles (${roles.length})`,
                value: roles.join(' ').length < 1025 ? roles.join(' ') : 'Sorry, there are too many roles, so I cannot display them here'
            },
            {
                name: `Channels (${channels.length})`,
                value: channels.join(' ').length < 1025 ? channels.join(' ') : 'Sorry, there are too many channels, so I cannot display them here'
            }
        ]);

    return message.channel.send(output);
};

export const command: Command = {
    name: 'serverinfo',
    category: 'UTILITY',
    aliases: ['si', 'server', 'guildinfo', 'gi'],
    description: 'Display a lot of info about the server.',
    usage: '',
    developerOnly: true,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
