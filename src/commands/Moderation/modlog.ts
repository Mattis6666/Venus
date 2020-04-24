import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { getInfractions } from '../../database';
import { getUser } from '../../utils/getters';
import { newEmbed, nicerDates, trimString, wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;
    if (args.length && !message.member!.permissions.has('MANAGE_MESSAGES')) return wrongSyntax(message, strings.NO_PERMS);

    const user = args.filter(arg => arg.match(/^\d{17,19}$/))[0];
    const member = user ? await message.client.users.fetch(user) : args.length ? await getUser(message, args) : message.author;
    if (!member) return;
    const infractions = await getInfractions(message.guild.id, member.id);
    if (!infractions.length)
        return message.channel.send(
            member.id === message.author.id
                ? replace(strings.USER_NO_INFRACTIONS, {
                      USER: member.username
                  })
                : replace(strings.MEMBER_NO_INFRACTIONS, {
                      MEMBER: member.username,
                      AUTHOR: message.member!.displayName
                  })
        );

    const output = newEmbed(true)
        .setTitle(
            replace(strings.MODLOG, {
                MEMBER: member.username
            })
        )
        .setThumbnail(member.displayAvatarURL({ size: 256, dynamic: true }))
        .addFields(
            infractions.map(infraction => {
                return {
                    name: `**${strings[infraction.infractionType]}** ~ ${strings.CASE} #${infraction.case}`,
                    value: trimString(
                        `**${strings.MODERATOR}:** ${message.guild!.members.cache.get(infraction.moderator.id) || infraction.moderator.tag}\n**${
                            strings.DATE
                        }:** ${nicerDates(infraction.timestamp)}\n**${strings.REASON}:** ${infraction.reason}`,
                        1024
                    )
                };
            })
        );
    return message.channel.send(output);
};

export const command: VenusCommand = {
    name: 'modlog',
    category: 'MODERATION',
    aliases: ['ml', 'warns', 'infractions'],
    developerOnly: false,
    requiresArgs: 0,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
