import { wrongSyntax } from './Util';
import { VenusClient, VenusMessage, VenusCommandStrings } from '../interfaces/Client';
import { getGuild } from '../database';
import { Guild } from '../database/schemas/GuildSchema';
import { Collection, Snowflake, Role, User, GuildMember } from 'discord.js';

export const getUser = async (message: VenusMessage, args: string[], spot?: number) => {
    if (message.guild) return (await getMember(message, args))?.user;

    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETROLE');

    const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const user = message.mentions.users?.first() || message.client.users.cache.get(input) || (await message.client.users.fetch(input).catch(() => null));
    if (user) return user;

    const userSearch = message.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));

    switch (userSearch.size) {
        case 0:
            return wrongSyntax(message, errors.NO_USER_FOUND);
        case 1:
            return userSearch.first();
        case 2:
        case 3:
            return (await chooseOne(message, userSearch, errors)) as User;
        default:
            return wrongSyntax(message, `${errors.MULTIPLE_USERS_FOUND}: ${userSearch.size}`, false);
    }
};

export const getMember = async (message: VenusMessage, args: string[], spot?: number) => {
    if (!message.guild) throw new SyntaxError('getMember was used in a DmChannel.');

    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETROLE');

    const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const member = message.mentions.members?.first() || message.guild.members.cache.get(input) || message.guild.members.fetch(input).catch(() => null);
    if (member) return member;

    const memberSearch = message.guild.members.cache.filter(
        member => member.displayName.toLowerCase().includes(input) || member.user.tag.toLowerCase().includes(input)
    );

    switch (memberSearch.size) {
        case 0:
            wrongSyntax(message, errors.NO_MEMBER_FOUND);
            return null;
        case 1:
            return memberSearch.first();
        case 2:
        case 3:
            return (await chooseOne(message, memberSearch, errors)) as GuildMember;
        default:
            wrongSyntax(message, `${errors.MULTIPLE_MEMBERS_FOUND}: ${memberSearch.size}`, false);
            return null;
    }
};

export const getRole = async (message: VenusMessage, args: string[], spot?: number) => {
    if (!message.guild) throw new SyntaxError('getRole was used in a DmChannel.');

    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETROLE');

    const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const role = message.mentions.roles?.first() || message.guild.roles.cache.get(input);
    if (role) return role;

    const roleSearch = message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(input));

    switch (roleSearch.size) {
        case 0:
            return wrongSyntax(message, errors.NO_ROLE_FOUND);
        case 1:
            return roleSearch.first();
        case 2:
        case 3:
            return (await chooseOne(message, roleSearch, errors)) as Role;
        default:
            return wrongSyntax(message, `${errors.MULTIPLE_ROLES_FOUND}: ${roleSearch.size}`, false);
    }
};

const getName = (thing: Role | User | GuildMember) => (thing instanceof Role ? thing.name : thing instanceof User ? thing.tag : thing.user.tag);

export const chooseOne = async (message: VenusMessage, choices: Collection<Snowflake, Role | User | GuildMember>, strings: VenusCommandStrings) => {
    let i = 0;
    const options = choices.map(choice => {
        return { index: ++i, choice: choice };
    });

    await message.reply(`${strings.PROMPT}\n>>> ${options.map(o => `${o.index} | ${getName(o.choice)}`)}`);

    const choice = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 1000 * 30, errors: ['time'] }).catch(() => null);

    if (!choice || !choice.first()) return wrongSyntax(message, strings.PROMPT_TIMEOUT, false);

    return options.find(o => o.index === parseInt(choice.first()!.content))?.choice;
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
