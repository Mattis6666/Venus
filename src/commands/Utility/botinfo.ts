import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed } from '../../utils/Util';
import { botInfo } from '../../constants/botInfo';
import { emojis } from '../../constants/emojis';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, _args: string[], strings: CommandStrings) => {
    const output = newEmbed(true)
        .setAuthor(`About ${botInfo.name}`, message.client.user?.displayAvatarURL({ size: 256, dynamic: true }))
        .setDescription(`${emojis.crown} ${botInfo.developers.find(dev => dev.role.includes('Creator'))?.name}\n${emojis.date} ${botInfo.creationDate}`)
        .addFields([
            {
                name: strings.MADE_WITH,
                value: botInfo.dependencies.map(dep => `[${dep.name}](${dep.url} '${dep.version}') (${dep.type})`).join('\n'),
                inline: true
            },
            {
                name: strings.DEVELOPERS,
                value: botInfo.developers.map(dev => `[${dev.name}](${dev.github}) - ${dev.role}`),
                inline: true
            }
        ]);

    return message.channel.send(output);
};

export const command: Command = {
    name: 'botinfo',
    category: 'UTILITY',
    aliases: ['about', 'info'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
