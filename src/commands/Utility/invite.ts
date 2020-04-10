import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { newEmbed, replace } from '../../utils/Util';
import { botInfo } from '../../constants/botInfo';
import config from '../../utils/config';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = (message: Message, _args: string[], strings: CommandStrings) => {
    const output = newEmbed(true)
        .setAuthor(strings.INVITE_ME, message.client.user?.displayAvatarURL({ size: 256, dynamic: true }))
        .setDescription(
            `[${strings.CLICK_HERE}](${botInfo.botInvite})\n\n` +
                `${replace(strings.SET_PREFIX, {
                    PREFIX: config.defaultPrefix
                })}\`\n\n` +
                `[${strings.SUPPORT_SERVER}](${botInfo.supportServer})`
        );
    return message.channel.send(output);
};

export const command: Command = {
    name: 'botinvite',
    category: 'UTILITY',
    aliases: ['invite', 'inv'],
    description: 'Invite Venus to your server!',
    extended: '',
    usage: '',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
