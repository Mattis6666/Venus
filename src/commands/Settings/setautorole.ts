import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings, VenusClient } from '../../interfaces/Client';
import { getRole } from '../../utils/getters';
import { getGuild } from '../../database';
import { replace } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    const client = message.client as VenusClient;

    const guildSettings = await getGuild(message.guild!.id);
    if (!args.length) {
        guildSettings.welcome.autoRole = '';
        client.guildSettings.set(message.guild!.id, guildSettings);
        await guildSettings.save();
        return message.channel.send(strings.RESET);
    }
    const role = await getRole(message, args);
    if (!role) return;

    guildSettings.welcome.autoRole = role.id;
    client.guildSettings.set(message.guild!.id, guildSettings);
    await guildSettings.save();

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
