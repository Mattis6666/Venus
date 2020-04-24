import { wrongSyntax } from './Util';
import { VenusClient, VenusMessage } from '../interfaces/Client';
import { getGuild } from '../database';
import { Guild } from '../database/schemas/GuildSchema';

export const getUser = async (message: VenusMessage, args: string[], spot?: number) => {
    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETUSER');

    const input = spot ? args[spot] : args.join(' ');
    if (!args.length) return null;
    if (!message.guild) {
        const user = message.mentions.users.first() || message.client.users.cache.get(input) || (await message.client.users.fetch(input));
        if (user) return user;

        const userSearch = message.client.users.cache.filter(u => u.username.toLowerCase().includes(input.toLowerCase()));
        if (userSearch.size === 1) return userSearch.first();
        if (!userSearch.size) {
            return wrongSyntax(message, errors.NO_USER_FOUND);
        }
        if (userSearch.size > 1) {
            return wrongSyntax(
                message,
                `${errors.MULTIPLE_USERS_FOUND}: ${userSearch.size > 3 ? userSearch.size.toString() : userSearch.map(u => '`' + u.username + '`').join(', ')}`,
                false
            );
        }
    }
    return (await getMember(message, args))?.user;
};

export const getMember = async (message: VenusMessage, args: string[], spot?: number) => {
    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETMEMBER');

    const input = spot || spot === 0 ? args[spot].toLowerCase() : args.join(' ').toLowerCase();
    if (!input) return null;
    if (!message.guild) {
        throw new SyntaxError('getMember was used in a DmChannel.');
    }
    const member = message.mentions.members?.first() || message.guild.members.cache.get(input);
    if (member) return member;

    const memberSearch = message.guild.members.cache.filter(
        member => member.user.username.toLowerCase().includes(input) || member.displayName.toLowerCase().includes(input)
    );
    if (memberSearch.size === 1) return memberSearch.first();
    if (!memberSearch.size) {
        wrongSyntax(message, errors.NO_MEMBER_FOUND);
    }
    if (memberSearch.size > 1) {
        wrongSyntax(
            message,
            `${errors.MULTIPLE_MEMBERS_FOUND}: ${
                memberSearch.size > 3 ? memberSearch.size.toString() : memberSearch.map(m => '`' + (m.displayName || m.user.username) + '`').join(', ')
            }`,
            false
        );
    }
    return null;
};

export const getRole = async (message: VenusMessage, args: string[], spot?: number) => {
    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETROLE');

    const input = spot ? args[spot]?.toLowerCase() : args.join(' ').toLowerCase();
    if (!message.guild) {
        throw new SyntaxError('getRole was used in a DmChannel.');
    }
    const role = message.mentions.roles?.first() || message.guild.roles.cache.get(input);
    if (role) return role;

    const roleSearch = message.guild?.roles.cache.filter(role => role.name.toLowerCase().includes(input));
    if (roleSearch.size === 1) return roleSearch.first();
    if (!roleSearch.size) {
        wrongSyntax(message, errors.NO_ROLE_FOUND);
    }
    if (roleSearch.size > 1) {
        wrongSyntax(
            message,
            `${errors.MULTIPLE_ROLES_FOUND}: ${roleSearch.size > 3 ? roleSearch.size.toString() : roleSearch.map(r => '`' + r.name + '`').join(', ')}`,
            false
        );
    }
    return null;
};

export const getPrefix = async (client: VenusClient, guildId: string) => {
    const guildEntry: Guild = client.guildSettings.get(guildId) || (await getGuild(guildId));
    if (guildEntry && !client.guildSettings.get(guildId)) {
        client.guildSettings.set(guildId, guildEntry);
    }
    return guildEntry.settings.prefix || client.config.defaultPrefix;
};

export const getStrings = async (message: VenusMessage) => {
    const client = message.client as VenusClient;
    const guildSettings = message.guild ? await getGuild(message.guild.id) : null;
    const strings = client.languages.get(guildSettings?.settings.language || 'en_GB');
    return strings;
};
