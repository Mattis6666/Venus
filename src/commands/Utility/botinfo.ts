import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed } from '../../utils/Util';
import { botInfo } from '../../constants/botInfo';

const callback = (message: Message, _args: string[]) => {
    const output = newEmbed(true)
        .setAuthor(`About ${botInfo.name}`, message.client.user?.displayAvatarURL({ size: 256, dynamic: true }))
        .setDescription(`**Creator:** ${botInfo.developers.find(dev => dev.role.includes('Creator'))?.name}\n**Creation Date:** ${botInfo.creationDate}`)
        .addField('Made with', botInfo.dependencies.map(dep => `[${dep.name}](${dep.url} '${dep.version}') (${dep.type})`).join('\n'));

    return message.channel.send(output);
};

export const command: Command = {
    name: 'botinfo',
    category: 'UTILITY',
    aliases: ['about', 'info'],
    description: 'Find out more about Venus!',
    usage: '',
    developerOnly: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
