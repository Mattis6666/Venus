import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { wrongSyntax } from '../../utils/Util';

const callback = (message: Message, args: string[]) => {
    if (!message.guild) return;

    const name = args[0].replace(/\W/g, '');
    if (!name) return wrongSyntax(message, 'You did not provide a valid emoji name.');
    console.log(name);
    const url = message.attachments.first()?.url || args[1];
    if (!url) return wrongSyntax(message, 'You did not provide an url or attachment!');
    return message.guild.emojis
        .create(url, name, { reason: `Created by ${message.author.tag} via createemote command ` })
        .then(emoji => message.channel.send(`Sucessfully created your emote ${name}: ${emoji}`))
        .catch(() =>
            message.channel.send(
                'Could not create your emote. This is either because this server does not have any free emote slots or because the provided image is bigger than 256kb.'
            )
        );
};

export const command: Command = {
    name: 'createemoji',
    category: 'MODERATION',
    aliases: ['createemote', 'ce'],
    description: 'Create an emote',
    usage: '<name> <url OR attachment>',
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
