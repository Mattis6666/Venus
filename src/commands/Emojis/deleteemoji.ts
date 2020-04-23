import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { wrongSyntax, replace } from '../../utils/Util';
import { emojis } from '../../constants/emojis';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;
    const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/g;
    const emotes = args.join(' ').match(regex);
    if (!emotes) return wrongSyntax(message, strings.NO_EMOJIS);

    const guildEmotes = emotes.map(e => message.guild!.emojis.resolve(e.substring(e.lastIndexOf(':') + 1, e.lastIndexOf('>')))).filter(e => e);
    if (!guildEmotes.length) return wrongSyntax(message, strings.NO_GUILD_EMOJIS);

    message.channel.startTyping();

    let i = 0;
    const msg = await message.channel.send(
        replace(strings.INITIAL, {
            EMOJI: emojis.loading,
            TOTAL: guildEmotes.length + ''
        })
    );
    await Promise.all(
        guildEmotes.map(e =>
            e
                ?.delete(
                    replace(strings.REASON, {
                        member: message.author.tag
                    })
                )
                .then(() => {
                    i++;
                    msg.edit(
                        replace(strings.PROGRESS, {
                            EMOJI: emojis.loading,
                            COUNT: i + '',
                            TOTAL: guildEmotes.length + ''
                        })
                    );
                })
        )
    ).catch(() => message.channel.stopTyping());

    message.channel.stopTyping();
    return msg.edit(
        i === guildEmotes.length
            ? replace(strings.SUCCESS, {
                  EMOJI: emojis.success,
                  COUNT: i + ''
              })
            : replace(strings.FAILURE, {
                  EMOJI: emojis.success,
                  COUNT: i + '',
                  TOTAL: guildEmotes.length + ''
              })
    );
};

export const command: VenusCommand = {
    name: 'deleteemoji',
    category: 'MODERATION',
    aliases: ['deleteemote', 'de'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'MANAGE_EMOJIS',
    botPermissions: 'MANAGE_EMOJIS',
    callback: callback
};
