import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { getInfractions } from '../../database/mongo';
import { newEmbed, wrongSyntax, replace } from '../../utils/Util';
import { getMember } from '../../utils/getters';
import { isMemberHigher } from '../../utils/checks';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    if (!message.guild) return;

    const member = await getMember(message, args, 0);
    if (!member) return;

    if (!isMemberHigher(message.member!, member)) return wrongSyntax(message, strings.NOT_HIGHER);

    const reason = args.length > 1 ? args.splice(1).join(' ') : strings.NO_REASON;
    const infractions = await getInfractions(message.guild.id);
    await infractions.createInfraction(message, member.user.id, 'warn', reason);
    infractions.save();
    const output = newEmbed()
        .setTitle('Warn')
        .setDescription(
            replace(strings.WARN_DM, {
                GUILD: message.guild.name
            })
        )
        .addFields([
            { name: strings.MEMBER, value: member.user.tag },
            { name: strings.MOD, value: message.author.tag },
            { name: strings.REASON, value: reason }
        ])
        .setThumbnail(member.user.displayAvatarURL({ size: 256, dynamic: true }));

    await member.user.send(output).catch(() => null);
    return message.channel.send(
        output.setDescription(
            replace(strings.MEMBER_WARNED, {
                MEMBER: member.displayName
            })
        )
    );
};

export const command: Command = {
    name: 'warn',
    category: 'MODERATION',
    aliases: [],
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_MESSAGES',
    botPermissions: '',
    callback: callback
};
