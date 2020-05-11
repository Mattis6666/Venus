import { readdirSync } from 'fs';
import { join } from 'path';
import { VenusClient as Client, VenusCommand, VenusCommandStrings } from './interfaces/Client';
import { logError, logWarn } from './utils/winston';

export const VenusClient = new Client();

const languagePath = join(__dirname, '../i18n'),
    listenerPath = join(__dirname, './events'),
    commandPath = join(__dirname, './commands'),
    inhibitorPath = join(__dirname, './inhibitors');

readdirSync(listenerPath).forEach(file => {
    const event = require(`${listenerPath}/${file}`).default;
    const eventName: any = file.replace('.js', '');
    VenusClient.on(eventName, event.bind(null, VenusClient));
});

readdirSync(commandPath).forEach(folder => {
    const commandFiles = readdirSync(`${commandPath}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command: VenusCommand = require(`${commandPath}/${folder}/${file}`).command;
        VenusClient.commands.set(command.name, command);
    }
});

readdirSync(inhibitorPath).forEach(file => {
    const inhibitor = require(`${inhibitorPath}/${file}`).default;
    const inhibitorName = file.replace('.js', '');
    VenusClient.inhibitors.set(inhibitorName, inhibitor);
});

readdirSync(languagePath).forEach(folder => {
    const languageFiles: { command: string; strings: VenusCommandStrings }[] = [];
    readdirSync(`${languagePath}/${folder}`).forEach(subfolder => {
        readdirSync(`${languagePath}/${folder}/${subfolder}`)
            .filter(file => file.endsWith('.json'))
            .forEach(file => {
                const str: VenusCommandStrings = require(`${languagePath}/${folder}/${subfolder}/${file}`);
                languageFiles.push({ command: file.replace('.json', ''), strings: str });
            });
    });
    VenusClient.languages.set(folder, languageFiles);
});

VenusClient.login(VenusClient.config.token);

process.on('uncaughtException', logError);
process.on('warning', logWarn);
