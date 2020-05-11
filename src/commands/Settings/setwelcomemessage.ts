import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    if (!args.length) {
        guildSettings.welcome.message = '';
        guildSettings.save();
        return message.channel.send(strings.RESET);
    }

    guildSettings.welcome.message = args.join(' ');
    await guildSettings.save();

    return message.channel.send(strings.SUCCESS);
};

export const command: VenusCommand = {
    name: 'setwelcomemessage',
    category: 'SETTINGS',
    aliases: ['setwelcome', 'welcomemessage', 'wmessage', 'welcome'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
