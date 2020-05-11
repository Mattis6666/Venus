import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { getTags } from '../../database';
import { wrongSyntax, newEmbed, replace } from '../../utils/Util';
import util from 'util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const tagEntry = await getTags(message.guild.id);
    if (!args.length)
        return message.channel.send(
            newEmbed(true)
                .setTitle(strings.TAGS)
                .setDescription(tagEntry.tags.map(tag => tag.trigger).join(', '))
        );

    const trigger = args[0].toLowerCase();

    const tag = tagEntry.tags.find(tag => tag.trigger === trigger);
    if (!tag) return wrongSyntax(message, strings.NOT_A_TAG, false);

    const embed = newEmbed(true)
        .setTitle(tag.trigger)
        .setDescription(!tag.embed ? tag.response : '```js\n' + util.inspect(tag.response) + '```')
        .setFooter(
            replace(strings.CREATED_BY, {
                AUTHOR: message.guild.members.cache.get(tag.author.id)?.user.tag || tag.author.tag
            })
        );
    return message.channel.send(embed);
};

export const command: VenusCommand = {
    name: 'tagshow',
    category: 'SETTINGS',
    aliases: ['showtag', 'tagview', 'viewtag', 'tags'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
