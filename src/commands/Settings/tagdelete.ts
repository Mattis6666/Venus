import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';
import { getTags } from '../../database/mongo';
import VenusClient from '../../interfaces/Client';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    if (!message.guild) return;
    const client = message.client as VenusClient;
    const trigger = args[0].toLowerCase();

    const tagEntry = await getTags(message.guild.id);
    if (['*', 'all', 'everything'].includes(trigger)) {
        tagEntry.tags = [];
        tagEntry.save();
        client.tags.set(message.guild.id, tagEntry);
        return message.channel.send(strings.DELETE_ALL);
    }
    const tag = tagEntry.tags.find(tag => tag.trigger === trigger);
    if (!tag) return wrongSyntax(message, strings.NOT_A_TAG);

    tagEntry.tags.splice(tagEntry.tags.indexOf(tag), 1);
    tagEntry.save();
    client.tags.set(message.guild.id, tagEntry);

    return message.channel.send(
        replace(strings.SUCCESS, {
            NAME: trigger,
            AUTHOR: message.guild.members.cache.get(tag.author.id)?.displayName || tag.author.tag
        })
    );
};

export const command: Command = {
    name: 'tagdelete',
    category: 'SETTINGS',
    aliases: ['deletetag', 'tagremove', 'removetag'],
    description: 'Remove a tag (custom command)',
    extended: '',
    usage: '<Tag Trigger>',
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
