import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import VenClient from '../../interfaces/Client';
import { getGuild } from '../../database/mongo';
import { wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, args: string[]) => {
    const client = message.client as VenClient;
    if (!message.guild) return;

    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    const commands = args.map(cmd => client.commands.find(command => command.name === cmd || command.aliases.includes(cmd))?.name).filter(cmd => cmd);

    commands.forEach(command => {
        if (command && !guildSettings.settings.disabledCommands.includes(command)) guildSettings.settings.disabledCommands.push(command);
    });
    if (!commands.length) return wrongSyntax(message, 'You did not provide any valid commands to disable!');

    await guildSettings.save();
    console.log(guildSettings);
    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(`The following commands have been disabled on this server: \`${commands.join(', ')}\``);
};

export const command: Command = {
    name: 'disable',
    category: 'SETTINGS',
    aliases: ['disablecommand', 'deactivate'],
    description: 'Disable one or multiple commands',
    usage: '<command name | command alias>',
    developerOnly: false,
    requiresArgs: 1,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    modOnly: false,
    adminOnly: true,
    callback: callback
};
