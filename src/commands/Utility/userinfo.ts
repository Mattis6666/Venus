import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { getUser } from '../../utils/getters';
import { newEmbed, nicerDates, nicerPermissions } from '../../utils/Util';
import { statusIcons } from '../../constants/statusIcons';
import { emojis } from '../../constants/emojis';

const callback = async (message: Message, args: string[]) => {
    const user = args.length ? await getUser(message, args) : message.author;
    if (!user) return;

    const userActivity = user.presence.activities.filter(p => p.type !== 'CUSTOM_STATUS')[0];
    const userInfo = newEmbed(true)
        .setAuthor(user.username, userActivity?.type === 'STREAMING' ? statusIcons.streaming : statusIcons[user.presence.status])
        .setThumbnail(user.displayAvatarURL({ size: 2048, dynamic: true }))
        .setDescription(
            `**Username:** ${(user.bot ? '🤖 ' : '') + user.tag}\n**User ID:** ${user.id}\n**Created at:** ${nicerDates(user.createdAt)}\n**Activity:** ${
                userActivity ? `${emojis[userActivity.type]} ${userActivity.name}` : '-'
            }\n**Status:** ${user.presence.activities.find(p => p.type === 'CUSTOM_STATUS')?.state || '-'}`
        );
    if (!message.guild) return message.channel.send(userInfo);

    const member = message.guild.member(user);
    if (!member) return message.channel.send(userInfo);

    userInfo
        .setAuthor(member.displayName, userActivity?.type === 'STREAMING' ? statusIcons.streaming : statusIcons[user.presence.status])
        .setColor(member.displayColor || 'DARK_GREY')
        .addFields([
            {
                name: 'Permissions',
                value: member.permissions
                    .toArray(true)
                    .map(p => nicerPermissions(p))
                    .join(', ')
            }
        ])
        .setDescription(
            `**Username:** ${(user.bot ? '🤖 ' : '') + user.tag}\n**User ID:** ${user.id}\n**Created at:** ${nicerDates(user.createdAt)}\n**Joined at:** ${
                member.joinedAt ? nicerDates(member.joinedAt) : '-'
            }\n**Activity:** ${userActivity ? `${emojis[userActivity.type]} ${userActivity.name}` : '-'}\n**Status:** ${
                user.presence.activities.find(p => p.type === 'CUSTOM_STATUS')?.state || '-'
            }\n**Highest Role:** ${member.roles.highest}\n**Role Colour:** ${member.displayHexColor.toUpperCase()}\n**Nitro Boosting:** ${
                member.premiumSince ? `${emojis.success} Since ${nicerDates(member.premiumSince)}` : emojis.fail
            }`
        );

    return message.channel.send(userInfo);
};

export const command: Command = {
    name: 'userinfo',
    category: 'UTILITY',
    aliases: ['ui', 'user', 'useri'],
    description: 'Display a lot of info about a user.',
    usage: '[User] (defaults to yourself)',
    developerOnly: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
