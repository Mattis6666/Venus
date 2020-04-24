import { VenusCommand, VenusCommandStrings, VenusClient, VenusMessage } from '../../interfaces/Client';
import { getGuild } from '../../database';

const callback = async (message: VenusMessage, _args: string[], strings: VenusCommandStrings) => {
    const client = message.client as VenusClient;
    if (!message.guild) return;

    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    const action = guildSettings.settings.nsfw ? false : true;
    guildSettings.settings.nsfw = action;
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

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
