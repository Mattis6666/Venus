import { VenusCommand, VenusCommandStrings, VenusClient, VenusMessage } from '../../interfaces/Client';
import { getGuild } from '../../database';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
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

export const command: VenusCommand = {
    name: 'disable',
    category: 'SETTINGS',
    aliases: ['disablecommand', 'deactivate'],
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
