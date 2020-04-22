import { VenusClient } from '../interfaces/Client';
import { logError } from '../utils/winston';

export default (_client: VenusClient, error: string) => {
    logError(error);
};
