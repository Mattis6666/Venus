import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings, VenusClient } from '../../interfaces/Client';
import { newEmbed, replace } from '../../utils/Util';
import { botInfo } from '../../constants/botInfo';

const callback = (message: Message, _args: string[], strings: VenusCommandStrings) => {
    const client = message.client as VenusClient;
    const output = newEmbed(true)
        .setAuthor(strings.INVITE_ME, message.client.user?.displayAvatarURL({ size: 256, dynamic: true }))
        .setDescription(
            `[${strings.CLICK_HERE}](${botInfo.botInvite})\n\n` +
                `${replace(strings.SET_PREFIX, {
                    PREFIX: client.config.defaultPrefix
                })}\n\n` +
                `[${strings.SUPPORT_SERVER}](${botInfo.supportServer})`
        );
    return message.channel.send(output);
};

export const command: VenusCommand = {
    name: 'invite',
    category: 'UTILITY',
    aliases: ['botinvite', 'inv'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
