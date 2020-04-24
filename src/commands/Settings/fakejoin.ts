import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { getMember } from '../../utils/getters';
import { replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const member = args.length ? await getMember(message, args) : message.member;
    if (!member) return;

    message.client.emit('guildMemberAdd', member);

    return message.channel.send(
        replace(strings.SUCCESS, {
            MEMBER: member.user.tag
        })
    );
};

export const command: VenusCommand = {
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
