import winston from 'winston';
import chalk from 'chalk';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.printf(log => chalkifyWinston(log))
        }),
        new winston.transports.File({ filename: 'winston.log', format: winston.format.printf(log => `[${date()}] ${log.message}`) })
    ]
});

export const logError = (error: string | Error | object) => logger.log('error', error.toString());
export const logInfo = (info: string) => logger.log('info', info);
export const logWarn = (warn: string | Error) => logger.log('warn', warn.toString());
export const logUncaught = (error: string) => logger.log('error', error);

const date = () => {
    const d = new Date();
    return `${d.getDay() > 9 ? d.getDay() : '0' + d.getDay()}.${
        d.getMonth() > 9 ? d.getMonth() : '0' + d.getMonth()
    }.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

const chalkifyWinston = (log: any) => {
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
