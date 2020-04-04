import { OwOify } from '../../utils/nekos';
import Command from '../../interfaces/Command';
import { Message } from 'discord.js';
import { wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, args: string[]) => {
    const owo = await OwOify(args.join(' '));
    if (!owo) return wrongSyntax(message, 'Sorry, I was unable to OwOify your input.');
    return message.channel.send(`*${message.author.username}, your OwOified message:*\n>>> ${owo}`);
};

export const command: Command = {
    name: 'owoify',
    category: 'ANIME',
    aliases: ['owo', 'uwuify', 'uwu'],
    description: 'OwOify your text.',
    extended: '',
    usage: '<text>',
    developerOnly: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 1,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
