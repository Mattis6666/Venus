import { Message, TextChannel } from 'discord.js';
import Command from '../../interfaces/Command';
import { registerQuestions } from '../../constants/registerQuestions';
import { newEmbed, wrongSyntax } from '../../utils/Util';
import { Promise } from 'bluebird';
import { getGuild } from '../../database/mongo';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, _args: string[], _strings: CommandStrings) => {
    if (!message.guild) return;

    const guildSettings = await getGuild(message.guild.id);

    const introChannel = message.guild.channels.cache.get(guildSettings.channels.introChannel);
    if (!introChannel) return wrongSyntax(message, 'Intros are not enabled on this server.');

    message.reply('I will send you a private message to collect your info. Please make sure your private messages are open!');
    const channel = await message.author.createDM();
    let fail = false;

    await channel
        .send(
            'I will now be asking you a couple of questions. Please only respond with the provided options or if none are provided, you can type anything. Please keep your answers below 300 characters.'
        )
        .catch(() => {
            fail = true;
            message.channel.send(
                `I was unable to send you a private message, ${message.author.username}. Please make sure they are open. You can close them again after registration is done!`
            );
        });
    if (fail) return;

    await Promise.mapSeries(registerQuestions, function (quest) {
        return new Promise(async (resolve, reject) => {
            if (fail) reject('Failed');
            await channel.send(
                quest.question + (quest.options.length ? '\n```' + quest.options.map(opt => `${opt.num} | ${opt.option}`).join('\n') + '```' : '')
            );
            const collector = channel.createMessageCollector(m => m.author === message.author, { max: 5, time: 1000 * 60 * 5 });
            let success = false;

            collector.on('collect', (m: Message) => {
                if (!quest.options.length || quest.options.some(q => q.num === m.content.toLowerCase())) {
                    const response = quest.options.length ? quest.options.find(q => q.num === m.content.toLowerCase())?.option : m.content;
                    if (!response) return channel.send('That was not a valid response!');
                    if (response.length > 300) return channel.send('Your response exceeded 300 characters!');
                    success = true;
                    collector.stop();
                    return (quest.response = response);
                } else return channel.send('That was not a valid response!');
            });

            collector.on('end', () => {
                if (!success) {
                    fail = true;
                    channel.send('You responded with invalid answers too often or the prompt timed out. Please run the command again to register.');
                    reject('Failed');
                }
                resolve('Success');
            });
        });
    }).catch(() => (fail = true));

    if (fail) return;

    channel.send('Thank you, your registration is now complete!');

    const output = newEmbed(true)
        .setDescription(registerQuestions.map(quest => `${quest.keyword}: \`${quest.response}\``))
        .setTitle(message.author.tag)
        .setThumbnail(message.author.displayAvatarURL({ size: 256, dynamic: true }));
    (introChannel as TextChannel).send(message.author, output).catch(() => null);
};

export const command: Command = {
    name: 'register',
    category: 'UTILITY',
    aliases: ['introduction'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
