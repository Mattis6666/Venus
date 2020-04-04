import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import query from '../../constants/animeQuery';
import { fetch, wrongSyntax, newEmbed, numToMonth, trimString, numToOrdinal } from '../../utils/Util';

const callback = async (message: Message, args: string[]) => {
    const data = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {
                search: args.join(' '),
                page: 1,
                perPage: 1
            }
        })
    });

    const media = data.data.Page.media[0];
    if (!media) return wrongSyntax(message, "Sorry, I wasn't able to find an anime matching your Search Term.");
    if (media.isAdult) return wrongSyntax(message, "Sorry, this Anime can't be displayed, because it's NSFW!");

    const names = media.synonyms;
    if (media.title.english !== 'null' && media.title.english) names.push(media.title.english);
    if (media.title.native !== 'null' && media.title.native) names.push(media.title.native);

    const output = newEmbed(true)
        .setTitle(media.title.romaji || media.title.english || media.title.english)
        .setURL(media.siteUrl)
        .setThumbnail(media.coverImage.extraLarge)
        .setImage(media.bannerImage)
        .setDescription(`${trimString(media.description.replace(/<[^>]*>/gi, ''), 2048)}\n[More Info can be found here!](${media.siteUrl})`)
        .addFields([
            { name: 'Other Names', value: names.join('\n') || '-' },
            { name: '🎲 Genres', value: media.genres.join(', ') || '-' },
            { name: '⏳ Status', value: media.status || '-', inline: true },
            { name: '⭐ Average Rating', value: media.averageScore ? media.averageScore + '%' : '-', inline: true },
            { name: '🎬 Format', value: media.format || '-', inline: true },
            { name: '💽 Episodes', value: media.episodes || media.chapters || '-', inline: true },
            {
                name: '🗓️ Started on',
                value: media.endDate.month ? `${numToMonth(media.startDate.month - 1)} ${numToOrdinal(media.startDate.day)} ${media.startDate.year}` : '-',
                inline: true
            },
            {
                name: '🗓️ Finished on',
                value: media.endDate.month ? `${numToMonth(media.endDate.month - 1)} ${numToOrdinal(media.endDate.day)} ${media.endDate.year}` : '-',
                inline: true
            }
        ]);
    return message.channel.send(output);
};

export const command: Command = {
    name: 'anime',
    category: 'ANIME',
    aliases: ['manga', 'ani'],
    description: 'Look up your favourite Anime or Manga!',
    usage: '[Anime Name]',
    developerOnly: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
