import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { wrongSyntax, replace } from '../../utils/Util';
import { emojis } from '../../constants/emojis';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/g;
    const emotes = args.join(' ').match(regex);
    if (!emotes) return wrongSyntax(message, '');

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
                message
                    .guild!.emojis.create(e.url, e.name, {
                        reason: replace(strings.REASON, {
                            COMMAND: command.name,
                            USER: message.author.tag
                        })
                    })
                    .catch(() => null)
            )
        ).catch(() => [])
    ).filter(e => e);

    message.channel.stopTyping();
    if (!output.length) return wrongSyntax(message, emojis.fail + strings.FAILURE);
    return message.channel.send(
        `${emojis.success} ${replace(strings.SUCCESS, {
            AMOUNT: output.length.toString(),
            EMOJIS: output.join(', ')
        })}`
    );
};

export const command: VenusCommand = {
    name: 'yoinkemotes',
    category: 'MODERATION',
    aliases: ['yoink', 'yoinkemojis', 'uploademotes', 'uploademojis'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'MANAGE_EMOJIS',
    botPermissions: 'MANAGE_EMOJIS',
    callback: callback
};
