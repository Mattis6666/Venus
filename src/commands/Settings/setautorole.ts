import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';
import { getRole } from '../../utils/getters';
import { getGuild } from '../../database/mongo';
import { replace } from '../../utils/Util';
import VenusClient from '../../interfaces/Client';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    const client = message.client as VenusClient;

    const guildSettings = await getGuild(message.guild!.id);
    if (!args.length) {
        guildSettings.welcome.autoRole = '';
        client.guildSettings.set(message.guild!.id, guildSettings);
        await guildSettings.save();
        return message.channel.send(strings.RESET);
    }
    const role = getRole(message, args);
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

export const command: Command = {
    name: 'setautorole',
    category: 'SETTINGS',
    aliases: ['autorole', 'joinrole'],
    description: 'Sets the role members get upon joining.',
    extended: 'Running the command without providing a role will disable autorole!',
    usage: '<Role (mention, Id, or name)>',
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
