import { GuildMember } from 'discord.js';

export const isMemberHigher = (member1: GuildMember, member2: GuildMember) => {
    return member1.roles.highest.comparePositionTo(member2.roles.highest) > 0;
};

export const isImageUrl = (url: unknown) => {
    return (
        typeof url === 'string' &&
        ['.png', '.gif', '.webp', '.jpg', '.jpeg'].some(ext => url.includes(ext)) &&
        (url.startsWith('https') || url.startsWith('http'))
    );
};
