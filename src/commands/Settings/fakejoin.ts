import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { getMember } from '../../utils/getters';
import { replace } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    const member = args.length ? await getMember(message, args) : message.member;
    if (!member) return;

    message.client.emit('guildMemberAdd', member);

    return message.channel.send(
        replace(strings.SUCCESS, {
            MEMBER: member.user.tag
        })
    );
};

export const command: Command = {
    name: 'fakejoin',
    category: 'SETTINGS',
    aliases: [],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
