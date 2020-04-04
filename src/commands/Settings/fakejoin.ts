import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import { getMember } from '../../utils/getters';

const callback = async (message: Message, args: string[]) => {
    const member = args.length ? await getMember(message, args) : message.member;
    if (!member) return;

    message.client.emit('guildMemberAdd', member);

    return message.channel.send(`Successfully created a fake join for ${member.user.tag}!`);
};

export const command: Command = {
    name: 'fakejoin',
    category: 'SETTINGS',
    aliases: [],
    description: 'Creates a fake join event.',
    extended: 'Useful for testing your welcome setup',
    usage: '[member] (defaults to yourself)',
    developerOnly: false,
    guildOnly: true,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: 'MANAGE_GUILD',
    botPermissions: '',
    modOnly: false,
    adminOnly: true,
    callback: callback
};
