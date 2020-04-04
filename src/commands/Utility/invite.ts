import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed } from '../../utils/Util';
import { botInfo } from '../../constants/botInfo';
import config from '../../utils/config';

const callback = (message: Message, _args: string[]) => {
    const output = newEmbed(true)
        .setAuthor('Invite me', message.client.user?.displayAvatarURL({ size: 256, dynamic: true }))
        .setDescription(
            `[Click here to invite me to your server!](${botInfo.botInvite} 'Invite ${botInfo.name}!')\n\n` +
                `To set my prefix once I joined, use \`${config.defaultPrefix}setprefix\`\n\n` +
                `Need help? [Join the support server!](${botInfo.supportServer} 'Join ${botInfo.name}\' Support server!')`
        );
    return message.channel.send(output);
};

export const command: Command = {
    name: 'botinvite',
    category: 'UTILITY',
    aliases: ['invite', 'inviteme'],
    description: 'Invite Venus to your server!',
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
