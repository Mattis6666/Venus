import { VenusClient, VenusCommand, VenusMessage } from '../interfaces/Client';
import { logCommands } from '../utils/winston';

export default (_client: VenusClient, message: VenusMessage, command: VenusCommand) => {
    logCommands(message, command);
};
