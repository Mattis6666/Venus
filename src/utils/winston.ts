import winston from 'winston';
import chalk from 'chalk';
import { TransformableInfo } from 'logform';
import { VenusCommand, VenusMessage } from '../interfaces/Client';
import { stripIndents } from 'common-tags';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.printf(log => chalkifyWinston(log))
        }),
        new winston.transports.File({ filename: 'logs/winston.log', format: winston.format.printf(log => `[${date()}] ${log.message}`) })
    ]
});

export const logError = (error: string | Error | object) => logger.log('error', error.toString());
export const logInfo = (info: string) => logger.log('info', info);
export const logWarn = (warn: string | Error) => logger.log('warn', warn.toString());
export const logUncaught = (error: string) => logger.log('error', error);

const date = (d = new Date()) => {
    const addZero = (num: number) => (num > 9 ? num : `0${num}`);
    return `${addZero(d.getDay())}.${addZero(d.getMonth())}.${d.getFullYear()} ${addZero(d.getHours())}:${addZero(d.getMinutes())}`;
};

const chalkifyWinston = (log: TransformableInfo) => {
    let message = log.message;
    switch (log.level) {
        case 'error':
            message = chalk.redBright(message);
            break;
        case 'info':
            message = chalk.cyan(message);
            break;
        case 'warn':
            message = chalk.yellow(message);
            break;
    }
    return `[${date()}] ${message}`;
};

// COMMAND LOGGING

export const commandLogger = winston.createLogger({
    transports: [new winston.transports.File({ filename: 'logs/commands.log', format: winston.format.printf(log => `[${date()}] ${log.message}`) })]
});

export const logCommands = (message: VenusMessage, command: VenusCommand) => {
    commandLogger.log(
        'info',
        stripIndents`
        ${command.name}
        User: ${message.author.tag} (${message.author.id})
        Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : '-'}
        Message: ${message.content}
        `
    );
};
