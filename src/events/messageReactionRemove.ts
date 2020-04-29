import { VenusClient, VenusMessage } from '../interfaces/Client';
import { MessageReaction, User } from 'discord.js';
import { getStrings } from '../utils/getters';
import { replace } from '../utils/Util';

export default async (client: VenusClient, reaction: MessageReaction, user: User) => {
    if (reaction.partial) reaction = await reaction.fetch();

    const guild = reaction.message.guild;
    if (!guild) return;

    const reactionRoles = await client.database.reactionRoles.findOne({ guild: guild.id, message: reaction.message.id, channel: reaction.message.channel.id });
    if (!reactionRoles) return;

    const reactionRole = reactionRoles.emojis.find(r => r.emoji === reaction.emoji.id);
    if (!reactionRole) return;

    const role = guild.roles.cache.get(reactionRole.role);
    if (!role) return;
    const strings = (await getStrings(reaction.message as VenusMessage))?.find(strings => strings.command === 'misc')?.strings;
    if (!strings) return;
    return guild
        .member(user)
        ?.roles.remove(role)
        .then(member => member.send(replace(strings.REACTION_ROLE_REMOVE, { ROLE: role.name, GUILD: guild.name })).catch(() => null))
        .catch(() => null);
};
