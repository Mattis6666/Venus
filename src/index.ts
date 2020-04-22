import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { VenusClient as Client, ClientEventTypes, VenusCommand, VenusCommandStrings } from './interfaces/Client';
import { logError, logWarn } from './utils/winston';

export const VenusClient = new Client({
    disableMentions: 'everyone',
    presence: {
        activity: {
            name: `${config.defaultPrefix}help`,
            type: 'LISTENING',
            url: 'https://www.twitch.tv/.'
        }
    },
    partials: ['MESSAGE', 'REACTION']
});

const languagePath = path.join(__dirname, '../../i18n'),
    listenerPath = path.join(__dirname, './events'),
    commandPath = path.join(__dirname, './commands');

fs.readdirSync(listenerPath).forEach(file => {
    const event = require(`${listenerPath}/${file}`).default;
    const eventName = file.replace('.js', '') as ClientEventTypes;
    VenusClient.on(eventName, event.bind(null, VenusClient));
});

fs.readdirSync(commandPath).forEach(async folder => {
    const commandFiles = fs.readdirSync(`${commandPath}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command: VenusCommand = require(`${commandPath}/${folder}/${file}`).command;
        VenusClient.commands.set(command.name, command);
    }
});

fs.readdirSync(languagePath).forEach(folder => {
    const languageFiles: { command: string; strings: VenusCommandStrings }[] = [];
    fs.readdirSync(`${languagePath}/${folder}`).forEach(subfolder => {
        fs.readdirSync(`${languagePath}/${folder}/${subfolder}`)
            .filter(file => file.endsWith('.json'))
            .forEach(file => {
                const str: VenusCommandStrings = require(`${languagePath}/${folder}/${subfolder}/${file}`);
                languageFiles.push({ command: file.replace('.json', ''), strings: str });
            });
    });
    VenusClient.languages.set(folder, languageFiles);
});

VenusClient.login(VenusClient.config.token);

process.on('uncaughtException', error => logError(error));
process.on('warning', warn => logWarn(warn));
