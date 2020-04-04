import VenClient from '../interfaces/Client';
import { logWarn } from '../utils/winston';

export default (_client: VenClient, warn: string) => {
    logWarn(warn);
};
