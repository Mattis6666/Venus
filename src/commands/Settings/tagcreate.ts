import { VenusCommand, VenusCommandStrings, VenusClient, VenusMessage } from '../../interfaces/Client';
import { getTags } from '../../database';
import { wrongSyntax, replace } from '../../utils/Util';
import { isImageUrl } from '../../utils/checks';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;
    const client = message.client as VenusClient;
    const [name, ...response] = args;
    const trigger = name.toLowerCase();
    const command = client.commands.get(trigger) || client.commands.find(cmd => cmd.aliases.includes(trigger));
    if (command) return wrongSyntax(message, replace(strings.NAME_TAKEN, { COMMAND: command.name }), false);

    const tagEntry = await getTags(message.guild.id);
    if (tagEntry.tags.some(tag => tag.trigger === trigger)) return wrongSyntax(message, strings.TAG_TAKEN, false);

    try {
        const embed = JSON.parse(response.join(' '));
        if (embed.color === 'RANDOM') embed.color = Math.floor(Math.random() * 0xffffff);
        if (embed.timestamp) embed.timestamp = new Date().toISOString();
        embed.image = isImageUrl(embed.image) ? { url: embed.image } : null;
        embed.thumbnail = isImageUrl(embed.thumbnail) ? { url: embed.thumbnail } : null;

        tagEntry.tags.push({ trigger: trigger, response: embed, embed: true, author: { id: message.author.id, tag: message.author.tag } });
    } catch (error) {
        if (response.join(' ').includes('{')) return message.channel.send(strings.FAILURE + '```js\n' + error + '```');
        tagEntry.tags.push({ trigger: trigger, response: response.join(' '), embed: false, author: { id: message.author.id, tag: message.author.tag } });
    }
    tagEntry.save();
    client.tags.set(message.guild.id, tagEntry);

    return message.channel.send(
        replace(strings.SUCCESS, {
            NAME: trigger
        })
    );
};

export const command: VenusCommand = {
    name: 'tagcreate',
    category: 'SETTINGS',
    aliases: ['createtag', 'tagadd', 'addtag'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 2,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
