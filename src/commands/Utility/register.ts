import { Message, TextChannel } from 'discord.js';
import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { registerQuestions } from '../../constants/registerQuestions';
import { newEmbed, wrongSyntax, replace } from '../../utils/Util';
import { Promise } from 'bluebird';
import { getIntros } from '../../database';

const callback = async (message: VenusMessage, _args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return wrongSyntax(message, strings.INTROS_DISABLED);

    const introChannel = message.guild.channels.cache.get(guildSettings.channels.introChannel);
    if (!introChannel) return wrongSyntax(message, strings.INTROS_DISABLED);
    const prefix = await message.client.getPrefix(message);

    const introEntry = await getIntros(message.author.id);
    if (introEntry.intros.some(intro => intro.guild === message.guild!.id))
        return wrongSyntax(
            message,
            replace(strings.ALREADY_REGISTERED, {
                PREFIX: prefix
            })
        );

    message.reply(strings.PRIVATE_MESSAGE);
    const channel = await message.author.createDM();
    let fail = false;

    await channel.send(strings.START).catch(() => {
        fail = true;
        message.channel.send(replace(strings.DM_FAILED, { USER: message.author.tag }));
    });
    if (fail) return;

    await new Promise(resolve => setTimeout(resolve, 1000 * 10));

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
                    if (!response) return channel.send(strings.INVALID_RESPONSE);
                    if (response.length > 300) return channel.send(strings.TOO_LONG);
                    success = true;
                    collector.stop();
                    return (quest.response = response);
                } else return channel.send(strings.INVALID_RESPONSE);
            });

            collector.on('end', () => {
                if (!success) {
                    fail = true;
                    channel.send(strings.FAILURE);
                    reject('Failed');
                }
                resolve('Success');
            });
        });
    }).catch(() => (fail = true));

    if (fail) return;

    const output = newEmbed(true)
        .setDescription(registerQuestions.map(quest => `${quest.keyword}: \`${quest.response}\``))
        .setTitle(message.author.tag)
        .setThumbnail(message.author.displayAvatarURL({ size: 256, dynamic: true }));
    const msg = await (introChannel as TextChannel).send(message.author, output).catch(() => null);
    if (!msg) return channel.send(strings.ERROR);
    introEntry.intros.push({
        message: msg.id,
        guild: msg.guild!.id,
        channel: msg.channel.id
    });
    introEntry.save();
    return channel.send(replace(strings.SUCCESS, { PREFIX: prefix }));
};

export const command: VenusCommand = {
    name: 'register',
    category: 'UTILITY',
    aliases: ['intro', 'introduction'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
