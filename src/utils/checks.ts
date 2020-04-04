import { GuildMember } from "discord.js";

export const isMemberHigher = (member1: GuildMember, member2: GuildMember) => {
  return member1.roles.highest.comparePositionTo(member2.roles.highest) > 0;
};
