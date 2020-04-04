import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed, fetch, trimString, nicerDates } from '../../utils/Util';

const callback = (message: Message, args: string[]) => {
    fetch('http://api.urbandictionary.com/v0/define?term=' + args.join('%20')).then(data => {
        if (!data) return;
        data = data.list[0];
        const output = newEmbed()
            .setTitle(data.word)
            .setURL(data.permalink)
            .setImage('https://wjlta.files.wordpress.com/2013/07/ud-logo.jpg')
            .setDescription(trimString(data.definition.replace(/(\[|\])/g, ''), 2048))
            .addField('Example', trimString(data.example.replace(/(\[|\])/g, ''), 1024))
            .setFooter(`👍 ${data.thumbs_up} | 👎 ${data.thumbs_down} | 👤 ${data.author} | 📆 ${nicerDates(Date.parse(data.written_on))}`);

        return message.channel.send(output);
    });
};

export const command: Command = {
    name: 'urbandictionary',
    category: 'UTILITY',
    aliases: ['urban', 'ud'],
    description: 'Get a definition from urbandictionary.com',
    usage: '<word to look up>',
    developerOnly: false,
    requiresArgs: 1,
    guildOnly: false,
    dmOnly: false,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
