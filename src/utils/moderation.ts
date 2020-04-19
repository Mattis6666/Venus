import { GuildMember, Message, TextChannel } from 'discord.js';
import { Infraction } from '../database/schemas/InfractionSchema';
import { newEmbed, replace } from './Util';
import CommandStrings from '../interfaces/CommandStrings';
import { getGuild } from '../database/mongo';
import { getStrings } from './getters';

export const logInfraction = async (message: Message, member: GuildMember, infraction: Infraction, strings: CommandStrings) => {
    const miscStrings = (await getStrings(message))?.find(strings => strings.command === 'misc')?.strings;
    if (!miscStrings) throw new Error('NO MISC STRINGS');

    if (!message.guild) throw new Error('THIS A DM RETARD');
    const settings = await getGuild(message.guild.id);
    const channel = settings.channels.modLogChannel ? message.guild.channels.cache.get(settings.channels.modLogChannel) : null;
    const output = newEmbed()
        .setTitle(miscStrings[infraction.infractionType])
        .setDescription(replace(strings.DM_MESSAGE, { GUILD: message.guild.name, ACTION: strings[infraction.infractionType] }))
        .addFields([
            { name: miscStrings.MEMBER, value: `${member} (${member.user.tag})` },
            { name: miscStrings.MODERATOR, value: `${message.author} (${message.author.tag})` },
            { name: miscStrings.REASON, value: infraction.reason }
        ])
        .setThumbnail(member.user.displayAvatarURL({ size: 256, dynamic: true }))
        .setFooter(`${miscStrings.CASE} ${infraction.case}`);

    await member.user.send(output).catch(() => null);
    output.setDescription(replace(strings.GUILD_MESSAGE, { MEMBER: member.displayName, ACTION: strings[infraction.infractionType] }));
    if (channel) (channel as TextChannel).send(output).catch(() => null);
    message.channel.send(output);
    return;
};
