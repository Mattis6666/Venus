import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { resetGuild } from '../../database/mongo';
import { wrongSyntax, replace } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, _args: string[], strings: CommandStrings) => {
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

export const command: Command = {
    name: 'resetserver',
    category: 'SETTINGS',
    aliases: [],
    description: 'Resets all my settings',
    extended: 'THIS WILL RESET ALL MY SETTINGS! This includes prefix, disabled commands, blocked channels, the welcome channel...',
    usage: '',
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'ADMINISTRATOR',
    botPermissions: '',
    callback: callback
};
