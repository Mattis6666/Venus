import VenClient from '../interfaces/Client';
import { GuildMember, TextChannel } from 'discord.js';

export default async (_client: VenClient, member: GuildMember) => {
    const channel = member.guild.channels.cache.get('696020170870882325');
    if (!channel) return;
    return (channel as TextChannel).send(`${member.user.tag} just joined!`);
};
