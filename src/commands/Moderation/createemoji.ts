import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = (message: Message, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const name = args[0].replace(/\W/g, '');
    if (!name) return wrongSyntax(message, strings.INVALID_NAME);
    console.log(name);
    const url = message.attachments.first()?.url || args[1];
    if (!url) return wrongSyntax(message, strings.NO_URL);
    return message.guild.emojis
        .create(url, name, {
            reason: replace(strings.REASON, {
                MEMBER: message.author.tag
            })
        })
        .then(emoji =>
            message.channel.send(
                replace(strings.SUCCESS, {
                    NAME: name,
                    EMOJI: emoji.toString()
                })
            )
        )
        .catch(() => message.channel.send(strings.FAILURE));
};

export const command: VenusCommand = {
    name: 'createemoji',
    category: 'MODERATION',
    aliases: ['createemote', 'ce'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'MANAGE_EMOJIS',
    botPermissions: 'MANAGE_EMOJIS',
    callback: callback
};
