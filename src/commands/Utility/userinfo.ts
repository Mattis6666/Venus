import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { getUser } from '../../utils/getters';
import { newEmbed, nicerDates, nicerPermissions, replace } from '../../utils/Util';
import { statusIcons } from '../../constants/statusIcons';
import { emojis } from '../../constants/emojis';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    const user = args.length ? await getUser(message, args) : message.author;
    if (!user) return;

    const member = message.guild?.member(user);
    const userActivity = user.presence.activities.filter(p => p.type !== 'CUSTOM_STATUS')[0];

    const userInfo = [
        {
            name: emojis.member,
            value: user.bot ? '🤖 ' : '' + user.tag
        },
        {
            name: emojis.hash,
            value: user.id
        },
        {
            name: emojis.birthday,
            value: nicerDates(user.createdAt)
        },
        {
            name: emojis.date,
            value: member?.joinedAt ? nicerDates(member.joinedAt) : null
        },
        {
            name: userActivity ? emojis[userActivity.type] : null,
            value: userActivity ? userActivity.name : null
        },
        {
            name: emojis.speechbubble,
            value: user.presence.activities.find(p => p.type === 'CUSTOM_STATUS')?.state || null
        },
        {
            name: emojis.diamond,
            value: member?.roles.highest
        },
        {
            name: emojis.art,
            value: member?.displayHexColor.toUpperCase()
        },
        {
            name: emojis.nitroBoost,
            value: message.guild
                ? member?.premiumSince
                    ? `${emojis.success} ${replace(strings.SINCE, { DATE: nicerDates(member.premiumSince) })}`
                    : emojis.fail
                : null
        }
    ].filter(x => x.value && x.name);

    const output = newEmbed(true)
        .setAuthor(member?.displayName || user.username, userActivity?.type === 'STREAMING' ? statusIcons.streaming : statusIcons[user.presence.status])
        .setColor(member?.displayColor || 'DARK_GREY')
        .setThumbnail(user.displayAvatarURL({ size: 2048, dynamic: true }))
        .setDescription(userInfo.map(info => `${info.name} ${info.value}`));
    if (member)
        output.addField(
            strings.PERMISSIONS,
            member.permissions
                .toArray(true)
                .map(p => nicerPermissions(p))
                .join(', ')
        );

    return message.channel.send(output);
};

export const command: Command = {
    name: 'userinfo',
    category: 'UTILITY',
    aliases: ['ui', 'user'],
    description: 'Display a lot of info about a user.',
    extended: '',
    usage: '[User] (defaults to yourself)',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
