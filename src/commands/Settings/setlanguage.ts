import { VenusCommand, VenusCommandStrings, VenusLanguages, VenusMessage } from '../../interfaces/Client';
import { replace, wrongSyntax } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
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
        },
        {
            code: 'fr_FR',
            aliases: ['français', 'fancais', 'fr']
        }
    ];

    const guildSettings = await message.client.getSettings(message);
    if (!guildSettings) return;

    const input = args.join(' ').toLowerCase();
    const language = languages.find(lang => lang.code.toLowerCase() === input || lang.aliases.includes(input));
    if (!language)
        return wrongSyntax(
            message,
            replace(strings.NO_LANGUAGE, {
                LANGUAGES: languages.map(lang => lang.code).join(', ')
            })
        );

    guildSettings.settings.language = language.code as VenusLanguages;
    guildSettings.save();

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
