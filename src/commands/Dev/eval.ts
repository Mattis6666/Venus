import { VenusCommand, VenusMessage } from '../../interfaces/Client';
import * as Util from '../../utils/Util';
import * as Getters from '../../utils/getters';
import { getGuild, getTags } from '../../database';
import { uploadHaste } from '../../utils/hastebin';

const callback = async (message: VenusMessage, args: string[]) => {
    // @ts-ignore
    const [client, commands, database, msg, guild, channel, util, getters] = [
        message.client,
        message.client.commands,
        message.client.database,
        message,
        message.guild,
        message.channel,
        Util,
        Getters
    ];
    // @ts-ignore
    const [guildsettings, strings, tags, infractions] = message.guild
        ? [await getGuild(message.guild.id), await Getters.getStrings(message), await getTags(message.guild.id)]
        : [null, null, null];

    try {
        let output =
            (await eval(`( async () => {
            ${args.join(' ')}
          })()`)) ||
            (await eval(`( async () => {
            return ${args.join(' ')}
          })()`));

        if (typeof output !== 'string') output = require('util').inspect(output);
        if (output.length > 2000) return message.channel.send(await uploadHaste(output));

        return message.channel.send(Util.clean(output), { code: 'xl' }).catch(err => {
            message.channel.send(Util.clean(err), { code: 'xl' });
        });
    } catch (err) {
        message.channel.send(Util.clean(err), { code: 'xl' });
    }
};

export const command: VenusCommand = {
    name: 'eval',
    category: 'DEVELOPMENT',
    aliases: [],
    developerOnly: true,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
