import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { emoteRegex, channelRegex } from '../../constants/regex';
import { wrongSyntax } from '../../utils/Util';
import { getRole } from '../../utils/getters';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const channel = message.mentions.channels?.first() || message.channel;
    const [msgID, emojiRaw, ...roleRaw] = args;

    const msg = await channel.messages.fetch(msgID).catch(() => null);
    if (!msg) return wrongSyntax(message, strings.NO_MESSAGE);

    if (!emoteRegex.test(emojiRaw)) return wrongSyntax(message, strings.NO_EMOJI);
    const emojiID = emojiRaw.slice(emojiRaw.lastIndexOf(':') + 1, emojiRaw.lastIndexOf('>'));
    const emoji = message.client.emojis.cache.get(emojiID);
    if (!emoji && !msg.reactions.cache.has(emojiID)) return wrongSyntax(message, strings.EMOJI_INACCESSIBLE);

    const role = await getRole(
        message,
        roleRaw.filter(val => !channelRegex.test(val))
    );
    if (!role) return wrongSyntax(message, strings.NO_ROLE);
    if (message.guild.me && role.position > message.guild.me?.roles.highest.position) return wrongSyntax(message, strings.ROLE_TOO_HIGH);
    if (role.managed) return wrongSyntax(message, strings.ROLE_MANAGED);

    const reacted = emoji ? await msg.react(emoji).catch(() => 'fail') : null;
    if (reacted === 'fail') return wrongSyntax(message, strings.REACT_FAILED);

    const reactionRole =
        (await message.client.database.reactionRoles.findOne({ guild: message.guild.id, channel: channel.id, message: msg.id })) ||
        (await message.client.database.reactionRoles.create({ guild: message.guild.id, channel: channel.id, message: msg.id }));
    if (reactionRole.emojis.some(reaction => reaction.emoji === emojiID)) return wrongSyntax(message, strings.EMOJI_TAKEN);
    reactionRole.emojis.push({ emoji: emojiID, role: role.id });
    reactionRole.save();
    return message.channel.send(strings.SUCCESS);
};

export const command: VenusCommand = {
    name: 'reactionrole',
    category: 'SETTINGS',
    aliases: ['reactionrolecreate', 'rr', 'rrc'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 3,
    userPermissions: 'MANAGE_ROLES',
    botPermissions: 'MANAGE_ROLES',
    callback: callback
};
