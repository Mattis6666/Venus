import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { getRole } from '../../utils/getters';
import { replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    if (!args.length) {
        guildSettings.welcome.autoRole = '';
        guildSettings.save();
        return message.channel.send(strings.RESET);
    }
    const role = await getRole(message, args);
    if (!role) return;

    guildSettings.welcome.autoRole = role.id;
    guildSettings.save();

    return message.channel.send(
        replace(strings.SUCCESS, {
            AUTOROLE: role.name
        })
    );
};

export const command: VenusCommand = {
    name: 'setautorole',
    category: 'SETTINGS',
    aliases: ['autorole', 'joinrole'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: 'MANAGE_ROLES',
    callback: callback
};
