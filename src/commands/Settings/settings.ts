import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';
import { getGuild } from '../../database/mongo';
import { newEmbed } from '../../utils/Util';
import VenusClient from '../../interfaces/Client';
import { emojis } from '../../constants/emojis';
import { GuildChannelSettings } from '../../database/schemas/GuildSchema';

const callback = async (message: Message, _args: string[], strings: CommandStrings) => {
    if (!message.guild) return;
    const client = message.client as VenusClient;
    const guildSettings = await getGuild(message.guild.id);
    const gs = guildSettings.settings;
    const gc = guildSettings.channels;
    const disabledCommands = gs.disabledCommands.join(', ');

    const settings = [
        { name: strings.PREFIX, value: gs.prefix || client.config.defaultPrefix },
        { name: strings.LANGUAGE, value: gs.language || 'en_GB' },
        { name: strings.NSFW, value: gs.nsfw ? emojis.success : emojis.fail },
        {
            name: strings.AUTO_ROLE,
            value: guildSettings.welcome.autoRole ? message.guild.roles.cache.get(guildSettings.welcome.autoRole) || emojis.fail : emojis.fail
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
        .setThumbnail(message.guild.iconURL({ size: 256, dynamic: true })!)
        .addFields([
            { name: strings.SETTINGS, value: settings.map(s => `**${s.name}:** ${s.value}`).join('\n') },
            { name: strings.CHANNELS, value: channels.map(c => `**${c.name}:** ${c.value}`).join('\n') }
        ]);
    if (disabledCommands) settingsEmbed.addField(strings.DISABLED_COMMANDS, disabledCommands);
    if (guildSettings.welcome.message) settingsEmbed.addField(strings.WELCOME_MESSAGE, guildSettings.welcome.message);
    return message.channel.send(settingsEmbed);
};

export const command: Command = {
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
