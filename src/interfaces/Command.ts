import { PermissionString, Message } from 'discord.js';
import { CommandCategories } from './CommandTypes';
import CommandStrings from './CommandStrings';

export default interface Command {
    name: string;
    aliases: string[];
    category: CommandCategories;
    developerOnly: boolean;
    nsfw: boolean;
    guildOnly: boolean;
    dmOnly: boolean;
    requiresArgs: number;
    userPermissions: PermissionString | '';
    botPermissions: PermissionString | '';
    callback(message: Message, args: string[], language: CommandStrings): Promise<Message | undefined | void> | void;
}
