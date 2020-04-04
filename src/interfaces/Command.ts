import { PermissionString, Message } from 'discord.js';
import { CommandCategories } from './CommandCategories';

export default interface Command {
    name: string;
    aliases: string[];
    category: CommandCategories;
    description: string;
    extended?: string;
    usage: string;
    developerOnly: boolean;
    guildOnly: boolean;
    dmOnly: boolean;
    requiresArgs: number;
    userPermissions: PermissionString | '';
    botPermissions: PermissionString | '';
    modOnly: boolean;
    adminOnly: boolean;
    callback(message: Message, args?: string[]): Promise<Message | undefined | void> | void;
}
