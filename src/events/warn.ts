import { VenusClient } from '../interfaces/Client';
import { logWarn } from '../utils/winston';

export default (_client: VenusClient, warn: string) => {
    logWarn(warn);
};
