import Config from '../interfaces/Config';

function getConfig() {
    if (process.env.NODE_ENV === 'production') {
        return require('../../config').config as Config;
    } else return require('../../devconfig').config as Config;
}

export default getConfig();
