import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { wrongSyntax } from '../../utils/Util';
import { emojis } from '../../constants/emojis';

const callback = async (message: Message, args: string[]) => {
    if (!message.guild) return;

    const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/g;
    const emotes = args.join(' ').match(regex);
    if (!emotes) return wrongSyntax(message, 'You did not provide any emotes!');

    const yoinkedEmotes = emotes.map(e => {
        return {
            name: e.slice(e.indexOf(':') + 1, e.lastIndexOf(':')),
            url: `https://cdn.discordapp.com/emojis/${e.slice(e.lastIndexOf(':') + 1, e.lastIndexOf('>'))}${e.startsWith('<a') ? '.gif' : '.png'}`
        };
    });
    message.channel.startTyping();
    const output = (
        await Promise.all(
            yoinkedEmotes.map(e =>
                message.guild!.emojis.create(e.url, e.name, { reason: 'Created via yoinkemotes command by' + message.author.username }).catch(() => null)
            )
        )
    ).filter(e => e);

    message.channel.stopTyping();
    if (!output.length)
        return wrongSyntax(
            message,
            emojis.fail + ' I was unable to yoink those emotes. This is most likely caused by this server not having any free emoji slots!'
        );
    return message.channel.send(`${emojis.success} I successfully yoinked ${output.length} emotes: ${output.join(' ')}`);
};

export const command: Command = {
    name: 'yoinkemotes',
    category: 'MODERATION',
    aliases: ['yoink', 'yoinkemojis', 'uploademotes', 'uploademojis'],
    description: 'Uploads emotes from other servers to your own server.',
    extended: 'Their name will be the name the other server gave them.',
    usage: '<emote> (You can provide as many as you want)',
    developerOnly: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'MANAGE_EMOJIS',
    botPermissions: 'MANAGE_EMOJIS',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
