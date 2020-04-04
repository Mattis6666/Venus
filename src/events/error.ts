import VenClient from '../interfaces/Client';
import { logError } from '../utils/winston';

export default (_client: VenClient, error: string) => {
    logError(error);
};
