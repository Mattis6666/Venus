import { Message } from 'discord.js';
import Command from '../../interfaces/Command';

import { getInfractions } from '../../database/mongo';
import { getMember } from '../../utils/getters';
import { newEmbed, nicerDates, trimString, wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, args: string[]) => {
    if (!message.guild) return;

    const infractions = await getInfractions(message.guild.id);
    const output = newEmbed(true);

    if (!args.length) {
        const modLog = infractions.members.find(ele => ele.userId === message.author.id);
        if (!modLog || !modLog.infractions.length) return message.channel.send(`You do not have any infractions, ${message.author.username}.`);

        output
            .setTitle('ModLog for ' + message.author.tag)
            .setThumbnail(message.author.displayAvatarURL({ size: 256, dynamic: true }))
            .addFields(
                modLog.infractions.map(infraction => {
                    return { name: `Moderator: ${infraction.moderator.username} ~ ${nicerDates(infraction.date)}`, value: trimString(infraction.reason, 1024) };
                })
            );
        return message.channel.send(output);
    }

    if (!message.member!.permissions.has('MANAGE_MESSAGES'))
        return wrongSyntax(message, "You require the `Manage Messages` Permission to see another users' Infractions!");
    const member = await getMember(message, args);
    if (!member) return;

    const modLog = infractions.members.find(ele => ele.userId === member.id);
    if (!modLog || !modLog.infractions.length) return message.channel.send(`This user does not have any infractions, ${message.author.username}.`);

    output
        .setTitle('ModLog for ' + member.user.tag)
        .setThumbnail(member.user.displayAvatarURL({ size: 256, dynamic: true }))
        .addFields(
            modLog.infractions.map(infraction => {
                return { name: `Moderator: ${infraction.moderator.username} ~ ${nicerDates(infraction.date)}`, value: infraction.reason };
            })
        );
    return message.channel.send(output);
};

export const command: Command = {
    name: 'modlog',
    category: 'MODERATION',
    aliases: ['ml', 'warns', 'infractions'],
    description: "Check a member's mod-log or your own.",
    extended: '',
    usage: '[user (mention, username or ID)]',
    developerOnly: false,
    requiresArgs: 0,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
