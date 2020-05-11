import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { newEmbed } from '../../utils/Util';
import { emojis } from '../../constants/emojis';
import { GuildChannelSettings } from '../../database/schemas/GuildSchema';

const callback = async (message: VenusMessage, _args: string[], strings: VenusCommandStrings) => {
    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    const gs = guildSettings.settings;
    const gc = guildSettings.channels;
    const disabledCommands = gs.disabledCommands.join(', ');

    const settings = [
        { name: strings.PREFIX, value: await message.client.getPrefix(message) },
        { name: strings.LANGUAGE, value: gs.language || 'en_GB' },
        { name: strings.NSFW, value: gs.nsfw ? emojis.success : emojis.fail },
        {
            name: strings.AUTO_ROLE,
            value: guildSettings.welcome.autoRole ? message.guild!.roles.cache.get(guildSettings.welcome.autoRole) || emojis.fail : emojis.fail
        }
    ];

    const channels = Object.keys(gc)
        .map(channel => {
            return {
                name: strings[channel],
                value: gc[channel as GuildChannelSettings] ? message.guild!.channels.cache.get(gc[channel as GuildChannelSettings]) || emojis.fail : emojis.fail
            };
        })
        .filter(ele => ele.name);

    const settingsEmbed = newEmbed(true)
        .setTitle(strings.TITLE)
        .setThumbnail(message.guild!.iconURL({ size: 256, dynamic: true })!)
        .addFields([
            { name: strings.SETTINGS, value: settings.map(s => `**${s.name}:** ${s.value}`).join('\n') },
            { name: strings.CHANNELS, value: channels.map(c => `**${c.name}:** ${c.value}`).join('\n') }
        ]);
    if (disabledCommands) settingsEmbed.addField(strings.DISABLED_COMMANDS, disabledCommands);
    if (guildSettings.welcome.message) settingsEmbed.addField(strings.WELCOME_MESSAGE, guildSettings.welcome.message);
    return message.channel.send(settingsEmbed);
};

export const command: VenusCommand = {
    name: 'settings',
    category: 'SETTINGS',
    aliases: ['viewsettings', 'showsettings', 's'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
