import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { getUser } from '../../utils/getters';
import { newEmbed } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], _strings: VenusCommandStrings) => {
    const user = (await getUser(message, args)) || message.author;
    return message.channel.send(
        newEmbed(true)
            .setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
            .setTitle(user.tag)
    );
};

export const command: VenusCommand = {
    name: 'avatar',
    category: 'UTILITY',
    aliases: ['av', 'pfp', 'picture', 'logo'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
