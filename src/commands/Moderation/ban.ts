import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { getMember } from '../../utils/getters';
import { isMemberHigher } from '../../utils/checks';
import { wrongSyntax, replace } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';
import { logInfraction } from '../../utils/moderation';
import { createInfraction } from '../../database/schemas/InfractionSchema';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    if (!message.guild || !message.member) return;
    const member = await getMember(message, args, 0);
    if (!member) return;
    if (!isMemberHigher(message.member, member)) return wrongSyntax(message, strings.NOT_HIGHER);
    if (!member.bannable) return wrongSyntax(message, strings.CANT_BAN);

    const m = await message.channel.send(
        replace(strings.CONFIRM, {
            MEMBER: member.user.tag,
            YES: strings.YES,
            NO: strings.NO
        })
    );
    let confirmed = false;
    const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 30 * 1000 });

    collector.on('collect', async (msg: Message) => {
        if (strings.YES.toLowerCase().includes(msg.content.toLowerCase())) {
            const reason = args.slice(1).join(' ') || strings.NO_REASON;
            const infraction = await createInfraction(message, member.user.id, 'ban', reason);
            await logInfraction(message, member, infraction, strings);

            member.ban({ reason: `Banned by ${message.author.tag}: ${reason}`, days: 7 });

            m.delete({ timeout: 10 * 1000 });
            msg.delete({ timeout: 10 * 1000 });

            confirmed = true;
            return collector.stop();
        }

        if (strings.NO.toLowerCase().includes(msg.content.toLowerCase())) {
            msg.delete({ timeout: 10 * 1000 });
            m.delete({ timeout: 10 * 1000 });

            confirmed = true;
            collector.stop();

            return wrongSyntax(message, strings.BAN_CANCEL);
        }

        return wrongSyntax(
            msg,
            replace(strings.INVALID_RESPONSE, {
                YES: strings.YES,
                NO: strings.NO
            }),
            false
        );
    });

    collector.on('end', () => {
        if (!confirmed) wrongSyntax(message, strings.TOO_SLOW);
        return;
    });
};

export const command: Command = {
    name: 'ban',
    category: 'MODERATION',
    aliases: ['hammer', 'b', 'yeet'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'BAN_MEMBERS',
    botPermissions: 'BAN_MEMBERS',
    callback: callback
};
