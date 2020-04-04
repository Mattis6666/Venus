import fs from 'fs';
import path from 'path';
import config from './utils/config';
import Client from './interfaces/Client';
import Command from './interfaces/Command';
import { logError, logWarn } from './utils/winston';
import { handleError } from './utils/Util';

export const VenClient = new Client({
    disableMentions: 'everyone',
    presence: {
        activity: {
            name: `${config.defaultPrefix}help`,
            type: 'LISTENING',
            url: 'https://www.twitch.tv/.'
        }
    }
});

const languagePath = path.join(__dirname, './i18n'),
    listenerPath = path.join(__dirname, './events'),
    commandPath = path.join(__dirname, './commands');

fs.readdirSync(listenerPath).forEach(file => {
    const event = require(`${listenerPath}/${file}`).default;
    const eventName: any = file.replace('.js', '');
    VenClient.on(eventName, event.bind(null, VenClient));
});

fs.readdirSync(commandPath).forEach(async folder => {
    const commandFiles = fs.readdirSync(`${commandPath}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command: Command = require(`${commandPath}/${folder}/${file}`).command;
        VenClient.commands.set(command.name, command);
    }
});

fs.readdirSync(languagePath).forEach(folder => {
    const languageFiles: { command: string; strings: object }[] = [];
    fs.readdirSync(`${languagePath}/${folder}`).forEach(subfolder => {
        fs.readdirSync(`${languagePath}/${folder}/${subfolder}`)
            .filter(file => file.endsWith('.js'))
            .forEach(file => {
                const str = require(`${languagePath}/${folder}/${subfolder}/${file}`).strings;
                languageFiles.push({ command: file.replace('.js', ''), strings: str });
            });
    });
    VenClient.languages.set(folder, languageFiles);
});

VenClient.login(config.token);

process.on('uncaughtException', error => logError(error));
process.on('warning', warn => logWarn(warn));
process.on('unhandledRejection', async reason => {
    if (reason) handleError(VenClient, reason);
});
