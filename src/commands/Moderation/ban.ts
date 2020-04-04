import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { getMember } from '../../utils/getters';
import { isMemberHigher } from '../../utils/checks';
import { wrongSyntax, newEmbed, trimString } from '../../utils/Util';

const callback = async (message: Message, args: string[]) => {
    if (!message.guild || !message.member) return;
    const member = await getMember(message, args);
    if (!member) return;
    if (!isMemberHigher(message.member, member)) return wrongSyntax(message, 'You cannot ban this user, because your highest role is not higher than theirs.');
    if (!member.bannable) return wrongSyntax(message, 'I am unable to ban this user. This is most likely because their role is higher than mine.');

    const m = await message.channel.send(`Do you really want to ban ${member.user.tag}?\nPlease respond with \`yes/y\` or \`no/n\``);
    let confirmed = false;
    const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 15 * 1000 });

    collector.on('collect', async (msg: Message) => {
        if (msg.content.toLowerCase() === 'yes' || msg.content.toLowerCase() === 'y') {
            const reason = args.slice(1).join(' ') || 'No reason provided.';
            const output = newEmbed(true)
                .setTitle('Ban')
                .setDescription(`You have been banned from ${message.guild!.name}! 🔨`)
                .addFields([
                    { name: 'User', value: member.user.tag },
                    { name: 'Moderator', value: message.author.tag },
                    { name: 'Reason', value: trimString(reason, 1024) }
                ]);

            await member.send(output).catch(() => null);
            member.ban({ reason: `banned by ${message.author.tag}: ${reason}}` });

            msg.delete({ timeout: 10 * 1000 });
            m.delete({ timeout: 10 * 1000 });

            confirmed = true;
            collector.stop();

            return message.channel.send(output.setDescription('User has been banned! 🔨'));
        } else if (msg.content.toLowerCase() === 'no' || msg.content.toLowerCase() === 'n') {
            msg.delete({ timeout: 10 * 1000 });
            m.delete({ timeout: 10 * 1000 });

            confirmed = true;
            collector.stop();

            return wrongSyntax(message, 'Ban has been cancelled!');
        } else {
            return wrongSyntax(msg, 'Invalid response! Please only respond with [y]es or [n]o!');
        }
    });

    collector.on('end', () => {
        if (!confirmed) wrongSyntax(message, 'You did not respond in time. Please run the command again.');
        return;
    });
};

export const command: Command = {
    name: 'ban',
    category: 'MODERATION',
    aliases: ['hammer', 'b', 'yeet'],
    description: 'ban a user',
    usage: '<User (Mention, ID or name)> [reason]',
    developerOnly: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: 'BAN_MEMBERS',
    botPermissions: 'BAN_MEMBERS',
    modOnly: true,
    adminOnly: false,
    callback: callback
};
