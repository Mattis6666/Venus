import { Message, TextChannel } from 'discord.js';
import { VenusCommand, VenusCommandStrings } from '../../interfaces/Client';
import { getIntros } from '../../database';
import { wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, _args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;
    const introEntry = await getIntros(message.author.id);
    const intro = introEntry.intros.find(intro => intro.guild === message.guild!.id);
    if (!intro) return wrongSyntax(message, strings.NOT_REGISTERED);

    const channel = message.guild.channels.cache.get(intro.channel);
    if (channel) (await (channel as TextChannel).messages.fetch(intro.message).catch(() => null))?.delete({ reason: strings.REASON }).catch(() => null);

    introEntry.intros.splice(introEntry.intros.indexOf(intro), 1);
    introEntry.save();

    return message.channel.send(strings.SUCCESS);
};

export const command: VenusCommand = {
    name: 'unregister',
    category: 'UTILITY',
    aliases: ['deleteintro', 'deregister'],
    developerOnly: false,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
