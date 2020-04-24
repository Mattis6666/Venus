import { VenusCommand, VenusCommandStrings, VenusClient, VenusMessage } from '../../interfaces/Client';
import { getGuild } from '../../database';
import { replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const client = message.client as VenusClient;
    if (!message.guild) return;

    const prefix = args[0];
    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    guildSettings.settings.prefix = prefix;
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

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
