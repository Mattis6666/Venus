import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    const commands = args.map(cmd => message.client.commands.find(command => command.name === cmd || command.aliases.includes(cmd))?.name).filter(cmd => cmd);

    commands.forEach(command => {
        if (command && !guildSettings.settings.disabledCommands.includes(command)) guildSettings.settings.disabledCommands.push(command);
    });
    if (!commands.length) return wrongSyntax(message, strings.NO_COMMAND);

    guildSettings.save();

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
