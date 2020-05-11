import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { wrongSyntax, replace } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    if (args.length === 1 && ['*', 'all', 'everything'].includes(args[0])) {
        guildSettings.settings.disabledCommands = [];
        guildSettings.save();
        return message.channel.send(strings.ENABLE_ALL);
    }
    const commands = args.map(cmd => message.client.commands.find(command => command.name === cmd || command.aliases.includes(cmd))?.name).filter(cmd => cmd);
    if (!commands.length) return wrongSyntax(message, strings.NO_COMMAND);

    commands.forEach(command => {
        if (command && guildSettings.settings.disabledCommands.includes(command))
            guildSettings.settings.disabledCommands.splice(guildSettings.settings.disabledCommands.indexOf(command), 1);
    });
    await guildSettings.save();

    return message.channel.send(
        replace(strings.SUCCESS, {
            COMMANDS: commands.join(', ')
        })
    );
};

export const command: VenusCommand = {
    name: 'enable',
    category: 'SETTINGS',
    aliases: ['enablecommand', 'activate'],
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
