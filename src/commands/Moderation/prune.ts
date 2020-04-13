import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';
import { linkRegex, inviteRegex, emoteRegex, emojiRegex } from '../../constants/regex';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    if (!message.guild) return;

    const filters: { [key: string]: (m: Message) => boolean } = {
        LINKS: (m: Message) => m.content.match(linkRegex) !== null,
        ATTACHMENTS: (m: Message) => m.attachments.size !== 0,
        BOTS: (m: Message) => m.author.bot,
        INVITES: (m: Message) => m.content.match(inviteRegex) !== null,
        EMOJIS: (m: Message) => (m.content.match(emoteRegex) || m.content.match(emojiRegex)) !== null,
        MENTIONS: (m: Message) => (m.mentions.users.size || m.mentions.roles.size) !== 0
    };

    const amount = args.map(arg => parseInt(arg)).filter(arg => arg && arg > 0 && arg < 101)[0];
    if (!amount) return wrongSyntax(message, strings.NO_AMOUNT);

    const userId = args.filter(arg => arg.match(/^\d{17,19}$/))[0];
    const author = userId ? message.guild.members.cache.get(userId)?.user || message.mentions.users.first() : message.mentions.users.first();

    await message.delete();

    let messages = await message.channel.messages.fetch({ limit: amount > 100 ? 100 : amount }).catch(() => null);
    if (!messages || !messages.size) return;

    Object.keys(filters)
        .filter(key => message.content.toLowerCase().includes(strings[key].toLowerCase()))
        .forEach(key => (messages = messages!.filter(filters[key])));

    if (author) messages = messages.filter(m => m.author.id === author.id);

    await message.channel.bulkDelete(messages, true).then(m => {
        return message.channel
            .send(replace(strings.SUCCESS, { AMOUNT: m.size.toString() }))
            .then(msg => msg.delete({ timeout: 1000 * 10 }))
            .catch(() => null);
    });
};

export const command: Command = {
    name: 'prune',
    category: 'MODERATION',
    aliases: ['clear', 'nuke', 'delete'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'MANAGE_MESSAGES',
    botPermissions: 'MANAGE_MESSAGES',
    callback: callback
};
