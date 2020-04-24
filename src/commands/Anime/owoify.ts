import { OwOify } from '../../utils/nekos';
import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const owo = await OwOify(args.join(' '));
    if (!owo) return wrongSyntax(message, strings.FAILURE);
    return message.channel.send(
        `*${replace(strings.SUCCESS, {
            USER: message.author.username
        })}:*\n>>> ${owo}`
    );
};

export const command: VenusCommand = {
    name: 'owoify',
    category: 'ANIME',
    aliases: ['owo', 'uwuify', 'uwu'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
