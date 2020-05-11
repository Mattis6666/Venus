import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';

const callback = async (message: VenusMessage, _args: string[], strings: VenusCommandStrings) => {
    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    const action = guildSettings.settings.nsfw ? false : true;
    guildSettings.settings.nsfw = action;
    await guildSettings.save();

    return message.channel.send(action ? strings.ENABLE : strings.DISABLE);
};

export const command: VenusCommand = {
    name: 'setnsfw',
    category: 'SETTINGS',
    aliases: ['nsfw', 'togglensfw'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
