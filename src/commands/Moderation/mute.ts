import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { getGuild } from '../../database';
import { emojis } from '../../constants/emojis';
import { getMember } from '../../utils/getters';
import { wrongSyntax } from '../../utils/Util';
import { createInfraction } from '../../database/schemas/InfractionSchema';
import { logInfraction } from '../../utils/moderation';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const member = await getMember(message, args, 0);
    if (!member) return;

    const settings = await getGuild(message.guild.id);
    if (!settings.roles.muted) {
        const msg = await message.channel.send(`${emojis.loading} ${strings.ROLE_CREATE}`);
        const role = await message.guild.roles.create({ data: { name: 'venus-mute' } }).catch(() => null);
        if (!role) return msg.edit(`${emojis.fail} ${strings.ROLE_CREATE_FAILURE}`);

        await Promise.all(message.guild.channels.cache.map(channel => channel.createOverwrite(role.id, { SEND_MESSAGES: false }))).catch(() => null);
        msg.edit(`${emojis.success} ${strings.ROLE_CREATE_SUCCESS}`);
        settings.roles.muted = role.id;
        settings.save();
    }

    const role = message.guild.roles.cache.get(settings.roles.muted) || (await message.guild.roles.fetch(settings.roles.muted).catch(() => null));
    if (!role) {
        settings.roles.muted = '';
        settings.save();
        return message.channel.send(`${emojis.fail} ${strings.INVALID_ROLE}`);
    }

    let action: 'unmute' | 'mute';
    if (member.roles.cache.has(role.id)) {
        const success = await member.roles.remove(role, 'Unmuted by ' + message.author.tag).catch(() => null);
        if (!success) return wrongSyntax(message, strings.UNMUTE_FAILURE);
        action = 'unmute';
    } else {
        const success = await member.roles.add(role, 'Muted by ' + message.author.tag).catch(() => null);
        if (!success) return wrongSyntax(message, strings.MUTE_FAILURE);
        action = 'mute';
    }

    const reason = args.slice(1).join(' ') || strings.NO_REASON;
    const infraction = await createInfraction(message, member.user.id, action, reason);
    return logInfraction(message, member, infraction, strings);
};

export const command: VenusCommand = {
    name: 'mute',
    category: 'MODERATION',
    aliases: [''],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'KICK_MEMBERS',
    botPermissions: 'MANAGE_ROLES',
    callback: callback
};
