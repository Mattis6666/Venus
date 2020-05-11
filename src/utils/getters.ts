import { wrongSyntax } from './Util';
import { VenusMessage, VenusCommandStrings } from '../interfaces/Client';
import { Collection, Snowflake, Role, User, GuildMember } from 'discord.js';

export const getUser = async (message: VenusMessage, args: string[], spot?: number) => {
    if (message.guild) return (await getMember(message, args))?.user;

    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETROLE');

    const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const user = message.mentions.users?.first() || message.client.users.cache.get(input) || (await message.client.users.fetch(input).catch(() => null));
    if (user) return user;

    const userSearch = message.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));

    if (userSearch.size === 0) {
        wrongSyntax(message, errors.NO_USER_FOUND);
        return null;
    } else if (userSearch.size === 1) {
        return userSearch.first();
    } else if (userSearch.size < 11) {
        return (await chooseOne(message, userSearch, errors)) as User;
    } else {
        wrongSyntax(message, `${errors.MULTIPLE_USERS_FOUND}: ${userSearch.size}`, false);
        return null;
    }
};

export const getMember = async (message: VenusMessage, args: string[], spot?: number) => {
    if (!message.guild) throw new SyntaxError('getMember was used in a DmChannel.');

    const errors = (await getStrings(message))?.find(str => str.command === 'errors')?.strings;
    if (!errors) throw new Error('NO ERROR STRINGS - GETROLE');

    const input = spot || spot === 0 ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

    const member = message.mentions.members?.first() || message.guild.members.cache.get(input) || (await message.guild.members.fetch(input).catch(() => null));
    if (member) return member;

    const memberSearch = message.guild.members.cache.filter(
        member => member.displayName.toLowerCase().includes(input) || member.user.tag.toLowerCase().includes(input)
    );

    if (memberSearch.size === 0) {
        wrongSyntax(message, errors.NO_MEMBER_FOUND);
        return null;
    } else if (memberSearch.size === 1) {
        return memberSearch.first();
    } else if (memberSearch.size < 11) {
        return (await chooseOne(message, memberSearch, errors)) as GuildMember;
    } else {
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

    if (roleSearch.size === 0) {
        wrongSyntax(message, errors.NO_ROLE_FOUND);
        return null;
    } else if (roleSearch.size === 1) {
        return roleSearch.first();
    } else if (roleSearch.size < 11) {
        return (await chooseOne(message, roleSearch, errors)) as Role;
    } else {
        wrongSyntax(message, `${errors.MULTIPLE_ROLES_FOUND}: ${roleSearch.size}`, false);
        return null;
    }
};

const getName = (thing: Role | User | GuildMember) => (thing instanceof Role ? thing.name : thing instanceof User ? thing.tag : thing.user.tag);

export const chooseOne = async (message: VenusMessage, choices: Collection<Snowflake, Role | User | GuildMember>, strings: VenusCommandStrings) => {
    let i = 0;
    const options = choices.map(choice => {
        return { index: ++i, choice: choice };
    });

    const msg = await message.reply(`${strings.PROMPT}\`\`\`${options.map(o => `${o.index} | ${getName(o.choice)}`).join('\n')}\`\`\``);

    const choice = (
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 1000 * 30, errors: ['time'] }).catch(() => null)
    )?.first();

    if (!choice) return wrongSyntax(message, strings.PROMPT_TIMEOUT, false);

    const result = options.find(o => o.index === parseInt(choice.content));
    if (!result) wrongSyntax(message, strings.INVALID_CHOICE, false);

    msg.delete().catch(() => null);
    choice.delete().catch(() => null);

    return result?.choice;
};

export const getStrings = async (message: VenusMessage) => {
    const guildSettings = await message.client.getSettings(message);
    const strings = message.client.languages.get(guildSettings?.settings.language || 'en_GB');
    return strings;
};
