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

    if (args.length === 1 && ['*', 'all', 'everything'].includes(args[0])) {
        guildSettings.settings.disabledCommands = [];
        await guildSettings.save();
        return message.channel.send('All commands have been enabled!');
    }
    const commands = args.map(cmd => client.commands.find(command => command.name === cmd || command.aliases.includes(cmd))?.name).filter(cmd => cmd);
    if (!commands.length) return wrongSyntax(message, 'You did not provide any valid commands to enable!');

    commands.forEach(command => {
        if (command && guildSettings.settings.disabledCommands.includes(command))
            guildSettings.settings.disabledCommands.splice(guildSettings.settings.disabledCommands.indexOf(command), 1);
    });
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(`The following commands have been enabled on this server: \`${commands.join(', ')}\``);
};

export const command: Command = {
    name: 'enable',
    category: 'SETTINGS',
    aliases: ['enablecommand', 'activate'],
    description: 'Enable one or multiple commands',
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
