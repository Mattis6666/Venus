import { Message, TextChannel, MessageEmbed, Client } from 'discord.js';
import config from './config';
import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch';
import ordinal from 'ordinal';
import { logError } from './winston';
import { inspect } from 'util';
import { milliseconds } from '../constants/milliseconds';

export const replace = (str: string, obj: { [prop: string]: string }) => {
    for (const prop in obj) {
        str = str.replace(new RegExp('{' + prop + '}', 'g'), obj[prop]);
    }
    return str;
};

export const chunkArray = (array: any[], n: number) => {
    const R = [];
    for (let i = 0; i < array.length; i += n) R.push(array.slice(i, i + n));
    return R;
};

export const trimString = (str: string, n: number) => {
    return str.length > n ? str.substring(0, n - 3) + '...' : str;
};

export const newEmbed = (timestamp = false) => {
    return timestamp ? new MessageEmbed().setColor('RANDOM').setTimestamp() : new MessageEmbed().setColor('RANDOM');
};

export const clean = (text: string) => {
    if (typeof text === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    }
    return text;
};

export const runSerial = (tasks: CallableFunction[]) => {
    let result = Promise.resolve();
    tasks.forEach(task => {
        result = result.then(() => task());
    });
    return result;
};

export const handleError = async (client: Client, err: Error) => {
    logError(err);
    const errorChannel = client.channels.cache.get(config.errorChannel) || (await client.channels.fetch(config.errorChannel));
    (errorChannel as TextChannel).send(
        (await Promise.all(config.developers.map(dev => client.users.cache.get(dev) || client.users.fetch(dev)))).join(' ') +
            '\n```' +
            (err instanceof Error ? err.stack : inspect(err)) +
            '```'
    );
};

export const fetch = async (requestInfo: RequestInfo, requestOptions?: RequestInit) => {
    const result = await nodeFetch(requestInfo, requestOptions)
        .then(response => {
            return response.json().then(json => {
                return response.ok ? json : Promise.reject(json);
            });
        })
        .catch(console.error);
    return result;
};

export const wrongSyntax = async (message: Message, text: string, del = true) => {
    const msg = await message.channel.send(text);
    if (!message.guild) return;
    msg.delete({ timeout: 1000 * 10 }).catch(() => null);
    if (del) message.delete({ timeout: 1000 * 10 }).catch(() => null);
};

export const numToMonth = (num: number) => {
    if (num > 11 || num < 0) throw new RangeError('Invalid month, retard.');
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num];
};

export const numToOrdinal = (num: number) => {
    return ordinal(num);
};

export const nicerDates = (date: Date | number = new Date()) => {
    if (!(date instanceof Date)) date = new Date(date);
    return `${numToMonth(date.getMonth())} ${ordinal(date.getDate())} ${date.getFullYear()}`;
};

export const nicerTimes = (date: Date | number = new Date()) => {
    if (!(date instanceof Date)) date = new Date(date);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export const nicerPermissions = (permission: string) => {
    return permission
        .toLowerCase()
        .split('_')
        .map(e => e.replace(/\w/, e.charAt(0).toUpperCase()))
        .join(' ');
};

export const stringToMs = (str: string) => {
    const times = str.match(/\d+(w|d|h|m|s){1}/gi);
    if (!times) return;

    let total = 0;
    times.forEach(time => {
        const amount = parseInt(time.replace(/[^\d]/gi, ''));
        const type = Object.keys(milliseconds).find(key => key.startsWith(time.replace(/\d/gi, '')));
        if (!amount || !type) return;
        total += amount * (milliseconds as any)[type];
    });
    return total;
};
