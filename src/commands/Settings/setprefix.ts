import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    const prefix = args[0];

    guildSettings.settings.prefix = prefix;
    await guildSettings.save();

    return message.channel.send(
        replace(strings.SUCCESS, {
            PREFIX: prefix
        })
    );
};

export const command: VenusCommand = {
    name: 'setprefix',
    category: 'SETTINGS',
    aliases: ['prefix', 'setp'],
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
