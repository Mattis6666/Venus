import fs from 'fs';
import path from 'path';
import config from './utils/config';
import Client from './interfaces/Client';
import Command from './interfaces/Command';
import { logError, logWarn } from './utils/winston';
import CommandStrings from './interfaces/CommandStrings';
import { ClientEvents } from './interfaces/ClientEvents';

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
VenusClient.config = config;

const languagePath = path.join(__dirname, '../../i18n'),
    listenerPath = path.join(__dirname, './events'),
    commandPath = path.join(__dirname, './commands');

fs.readdirSync(listenerPath).forEach(file => {
    const event = require(`${listenerPath}/${file}`).default;
    const eventName = file.replace('.js', '') as ClientEvents;
    VenusClient.on(eventName, event.bind(null, VenusClient));
});

fs.readdirSync(commandPath).forEach(async folder => {
    const commandFiles = fs.readdirSync(`${commandPath}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command: Command = require(`${commandPath}/${folder}/${file}`).command;
        VenusClient.commands.set(command.name, command);
    }
});

fs.readdirSync(languagePath).forEach(folder => {
    const languageFiles: { command: string; strings: CommandStrings }[] = [];
    fs.readdirSync(`${languagePath}/${folder}`).forEach(subfolder => {
        fs.readdirSync(`${languagePath}/${folder}/${subfolder}`)
            .filter(file => file.endsWith('.json'))
            .forEach(file => {
                const str: CommandStrings = require(`${languagePath}/${folder}/${subfolder}/${file}`);
                languageFiles.push({ command: file.replace('.json', ''), strings: str });
            });
    });
    VenusClient.languages.set(folder, languageFiles);
});

VenusClient.login(config.token);

process.on('uncaughtException', error => logError(error));
process.on('warning', warn => logWarn(warn));
