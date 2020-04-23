import { VenusClient, VenusCommand } from '../interfaces/Client';
import { Message } from 'discord.js';
import { logCommands } from '../utils/winston';

export default (_client: VenusClient, message: Message, command: VenusCommand) => {
    logCommands(message, command);
};
