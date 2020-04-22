import { Message } from 'discord.js';
import { VenusCommand, VenusCommandStrings, VenusClient, VenusLanguages } from '../../interfaces/Client';
import { getGuild } from '../../database';
import { replace, wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, args: string[], strings: VenusCommandStrings) => {
    const client = message.client as VenusClient;
    if (!message.guild) return;

    const languages = [
        {
            code: 'en_GB',
            aliases: ['english', 'en', 'british', 'gb']
        },
        {
            code: 'de_DE',
            aliases: ['german', 'de', 'deutsch']
        },
        {
            code: 'nl_NL',
            aliases: ['dutch', 'nederlands', 'nl']
        },
        {
            code: 'tr_TR',
            aliases: ['turkish', 'tr', 'türkçe']
        }
    ];

    const input = args.join(' ').toLowerCase();
    const language = languages.find(lang => lang.code.toLowerCase() === input || lang.aliases.includes(input));
    if (!language)
        return wrongSyntax(
            message,
            replace(strings.NO_LANGUAGE, {
                LANGUAGES: languages.map(lang => lang.code).join(', ')
            })
        );

    const guildSettings = await getGuild(message.guild.id);
    if (!guildSettings) return;

    guildSettings.settings.language = language.code as VenusLanguages;
    await guildSettings.save();

    client.guildSettings.set(message.guild.id, guildSettings);

    return message.channel.send(
        replace(strings.SUCCESS, {
            LANGUAGE: language.code
        })
    );
};

export const command: VenusCommand = {
    name: 'setlanguage',
    category: 'SETTINGS',
    aliases: ['language', 'setlang', 'lang'],
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    callback: callback
};
