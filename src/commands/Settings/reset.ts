import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { resetGuild } from '../../database';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: Message, _args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const guild = await resetGuild(message.guild.id);
    if (!guild)
        return wrongSyntax(
            message,
            replace(strings.NO_DB, {
                GUILD: message.guild.name
            })
        );

    return message.channel.send(strings.SUCCESS);
};

export const command: VenusCommand = {
    name: 'reset',
    category: 'SETTINGS',
    aliases: [],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'ADMINISTRATOR',
    botPermissions: '',
    callback: callback
};
