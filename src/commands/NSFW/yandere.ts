import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { fetch, wrongSyntax, newEmbed } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const result = (await fetch('https://yande.re/post.json?limit=100&tags=' + args.join('%20')))?.filter(
        (item: { [key: string]: string }) => !item.tags.includes('loli') && !item.tags.includes('shota')
    );
    if (!result || !result.length) return wrongSyntax(message, strings.NO_RESULT);

    const res = result[Math.floor(Math.random() * result.length)];
    const url = res.sample_url;
    if (!url) return wrongSyntax(message, strings.NO_RESULT);

    const output = newEmbed(true)
        .setImage(url)
        .setDescription(`[Source](${res.source || `https://yande.re/post/show/${res.id}`})`)
        .setFooter(`Author: ${res.author || 'Unknown'}`)
        .setTimestamp(res.created_at);

    return message.channel.send(output);
};

export const command: VenusCommand = {
    name: 'yandere',
    category: 'NSFW',
    aliases: ['yande.re'],
    developerOnly: false,
    nsfw: true,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
