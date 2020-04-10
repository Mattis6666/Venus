import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import VenusClient from '../../interfaces/Client';
import { getGuild } from '../../database/mongo';
import { wrongSyntax, replace } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, args: string[], strings: CommandStrings) => {
    const client = message.client as VenusClient;
    if (!message.guild) return;

    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    const commands = args.map(cmd => client.commands.find(command => command.name === cmd || command.aliases.includes(cmd))?.name).filter(cmd => cmd);

    commands.forEach(command => {
        if (command && !guildSettings.settings.disabledCommands.includes(command)) guildSettings.settings.disabledCommands.push(command);
    });
    if (!commands.length) return wrongSyntax(message, strings.NO_COMMAND);

    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(
        replace(strings.SUCCESS, {
            COMMANDS: commands.join(', ')
        })
    );
};

export const command: Command = {
    name: 'disable',
    category: 'SETTINGS',
    aliases: ['disablecommand', 'deactivate'],
    description: 'Disable one or multiple commands',
    extended: '',
    usage: '<command name | command alias>',
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
