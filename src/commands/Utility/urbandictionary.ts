import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed, fetch, trimString, nicerDates, wrongSyntax } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = (message: Message, args: string[], strings: CommandStrings) => {
    if (message.channel.type === 'text' && !message.channel.nsfw) return wrongSyntax(message, strings.NSFW);

    return fetch('http://api.urbandictionary.com/v0/define?term=' + args.join('%20'))
        .then(data => {
            if (!data) Promise.reject();
            data = data.list[0];
            const output = newEmbed()
                .setTitle(data.word)
                .setURL(data.permalink)
                .setImage('https://wjlta.files.wordpress.com/2013/07/ud-logo.jpg')
                .setDescription(trimString(data.definition.replace(/(\[|\])/g, ''), 2048))
                .addField('Example', trimString(data.example.replace(/(\[|\])/g, ''), 1024))
                .setFooter(`👍 ${data.thumbs_up} | 👎 ${data.thumbs_down} | 👤 ${data.author} | 📆 ${nicerDates(Date.parse(data.written_on))}`);

            return message.channel.send(output);
        })
        .catch(() => wrongSyntax(message, strings.NO_MATCH));
};

export const command: Command = {
    name: 'urbandictionary',
    category: 'UTILITY',
    aliases: ['urban', 'ud'],
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
