import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { wrongSyntax } from '../../utils/Util';
import { emojis } from '../../constants/emojis';

const callback = async (message: Message, args: string[]) => {
    if (!message.guild) return;
    const regex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/g;
    const emotes = args.join(' ').match(regex);
    if (!emotes) return wrongSyntax(message, 'You did not provide any emotes!');

    const guildEmotes = emotes.map(e => message.guild!.emojis.resolve(e.substring(e.lastIndexOf(':') + 1, e.lastIndexOf('>')))).filter(e => e);
    if (!guildEmotes.length) return wrongSyntax(message, 'You did not provide any emotes that are from this server!');

    message.channel.startTyping();

    let i = 0;
    const msg = await message.channel.send(`${emojis.loading} Successfully deleted 0/${guildEmotes.length} emojis!`);
    await Promise.all(
        guildEmotes.map(e =>
            e?.delete(`Deleted by ${message.author.tag} via deleteemoji command`).then(() => {
                i++;
                msg.edit(`${emojis.loading} I successfully deleted ${i}/${guildEmotes.length} emojis!`);
            })
        )
    );

    message.channel.stopTyping();
    return msg.edit(
        i === guildEmotes.length
            ? `${emojis.success} I successfully deleted ${i} emojis!`
            : `${emojis.fail} I only managed to delete ${i}/${guildEmotes.length} emojis!`
    );
};

export const command: Command = {
    name: 'deleteemoji',
    category: 'MODERATION',
    aliases: ['deleteemote', 'de'],
    description: 'Delete any amount of emotes',
    usage: '<emoji> (you can add as many as you wish)',
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
