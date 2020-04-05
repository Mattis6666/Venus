import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import * as Util from '../../utils/Util';
import * as Getters from '../../utils/getters';
import { getGuild, getInfractions } from '../../database/mongo';
import VenClient from '../../interfaces/Client';
import { uploadHaste } from '../../utils/hastebin';

const callback = async (message: Message, args: string[]) => {
    // @ts-ignore
    const [client, commands, msg, guild, channel, getguild, getinfractions, util, getters, guildsettings, infractions] = [
        message.client as VenClient,
        (message.client as VenClient).commands,
        message,
        message.guild,
        message.channel,
        getGuild,
        getInfractions,
        Util,
        Getters,
        await getGuild(message.guild!.id),
        await getInfractions(message.guild!.id)
    ];
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

        message.channel.send(Util.clean(output), { code: 'xl' }).catch(err => {
            message.channel.send(Util.clean(err), { code: 'xl' });
        });
    } catch (err) {
        message.channel.send(Util.clean(err), { code: 'xl' });
    }
    return;
};

export const command: Command = {
    name: 'eval',
    category: 'DEVELOPMENT',
    aliases: [],
    description: '',
    extended: '',
    usage: '',
    developerOnly: true,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
