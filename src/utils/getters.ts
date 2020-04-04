import { wrongSyntax } from './Util';
import { Message } from 'discord.js';
import VenClient from '../interfaces/Client';
import { getGuild } from '../database/mongo';
import config from './config';

export const getUser = async (message: Message, args: string[]) => {
    if (!args.length) return null;
    if (!message.guild) {
        const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || (await message.client.users.fetch(args[0]));
        if (user) return user;

        const userSearch = message.client.users.cache.filter(u => u.username.toLowerCase().includes(args[0].toLowerCase()));
        if (userSearch.size > 1) {
            wrongSyntax(
                message,
                `I found multiple members matching your input: ${
                    userSearch.size > 3 ? userSearch.size : userSearch.map(r => '`' + r.username + '`').join(', ')
                }`
            );
        } else return wrongSyntax(message, 'Sorry, something went wrong (>_<)');
    } else return (await getMember(message, args))?.user;
};

export const getMember = async (message: Message, args: string[]) => {
    if (!args.length) return null;
    if (!message.guild) {
        throw new SyntaxError('getMember was used in a DmChannel.');
    }
    const member = message.mentions.members?.first() || message.guild.members.cache.get(args[0]);
    if (member) return member;

    const memberSearch = message.guild.members.cache.filter(
        member => member.user.username.toLowerCase().includes(args[0].toLowerCase()) || member.displayName.toLowerCase().includes(args[0].toLowerCase())
    );
    if (memberSearch.size === 1) return memberSearch.first();
    if (!memberSearch.size) {
        wrongSyntax(message, 'You did not provide a valid member. Please run the command again and provide one.');
    } else if (memberSearch.size > 1) {
        wrongSyntax(
            message,
            `I found multiple members matching your input: ${
                memberSearch.size > 3 ? memberSearch.size : memberSearch.map(r => '`' + r.displayName + '`').join(', ')
            }`
        );
    } else wrongSyntax(message, 'Sorry, something went wrong (>_<)');
    return null;
};

export const getRole = async (message: Message, args: string[]) => {
    if (!message.guild) {
        throw new SyntaxError('getRole was used in a DmChannel.');
    }
    const role = message.mentions.roles?.first() || message.guild.roles.cache.get(args[0]);
    if (role) return role;

    const roleSearch = message.guild?.roles.cache.filter(role => role.name.toLowerCase().includes(args[0].toLowerCase()));
    if (roleSearch.size === 1) return roleSearch.first();
    if (!roleSearch.size) {
        wrongSyntax(message, 'You did not provide a valid role. Please run the command again and provide one.');
    } else if (roleSearch.size > 1) {
        wrongSyntax(
            message,
            `I found multiple roles matching your input: ${roleSearch.size > 3 ? roleSearch.size : roleSearch.map(r => '`' + r.name + '`').join(', ')}`
        );
    } else wrongSyntax(message, 'Sorry, something went wrong (>_<)');
    return null;
};

export const getPrefix = async (client: VenClient, guildId: string) => {
    const guildEntry: any = client.guildSettings.get(guildId) || (await getGuild(guildId));
    if (guildEntry && !client.guildSettings.get(guildId)) {
        client.guildSettings.set(guildId, guildEntry);
    }
    return guildEntry.settings.prefix || config.defaultPrefix;
};
