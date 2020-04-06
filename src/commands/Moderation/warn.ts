import { Message } from 'discord.js';
import Command from '../../interfaces/Command';

import { getInfractions } from '../../database/mongo';
import { newEmbed } from '../../utils/Util';
import { getMember } from '../../utils/getters';

const callback = async (message: Message, args: string[]) => {
    if (!message.guild) return;
    const member = await getMember(message, args, 0);
    if (!member) return;
    const reason = args.length > 1 ? args.splice(1).join(' ') : 'No reason provided';
    const infractions = await getInfractions(message.guild.id);
    await infractions.createInfraction(message, member.user.id, 'warn', reason);
    infractions.save();
    const output = newEmbed()
        .setTitle('Warn')
        .setDescription(`${member} has successfully been warned.`)
        .addFields([
            { name: 'Member', value: member.user.tag },
            { name: 'Moderator', value: message.author.tag },
            { name: 'Reason', value: reason }
        ])
        .setThumbnail(member.user.displayAvatarURL({ size: 256, dynamic: true }));
    return message.channel.send(output);
};

export const command: Command = {
    name: 'warn',
    category: 'MODERATION',
    aliases: [],
    description: 'Warn a user',
    extended: '',
    usage: '<user (mention, username or ID)> [reason]',
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: '',
    botPermissions: '',
    modOnly: true,
    adminOnly: false,
    callback: callback
};
