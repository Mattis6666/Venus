import { Message, TextChannel, MessageEmbed, Client } from 'discord.js';
import config from './config';
import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch';
import ordinal from 'ordinal';
import { logError } from './winston';
import { inspect } from 'util';

export const trimString = (str: string, n: number) => {
    return str.length > n ? str.substring(0, n - 3) + '...' : str;
};

export const newEmbed = (timestamp: boolean = false) => {
    return timestamp ? new MessageEmbed().setColor('RANDOM').setTimestamp() : new MessageEmbed().setColor('RANDOM');
};

export const clean = (text: string) => {
    if (typeof text === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else return text;
};

export const handleError = async (client: Client, err: Error | Object) => {
    logError(err);
    const errorChannel = client.channels.cache.get(config.errorChannel) || (await client.channels.fetch(config.errorChannel));
    (errorChannel as TextChannel).send(
        (await Promise.all(config.developers.map(dev => client.users.cache.get(dev) || client.users.fetch(dev)))).join(' ') +
            '\n```' +
            (err instanceof Error ? err.stack : inspect(err)) +
            '```'
    );
};

export const fetch = async (RequestInfo: RequestInfo, requestOptions?: RequestInit) => {
    const result = await nodeFetch(RequestInfo, requestOptions)
        .then(response => {
            return response.json().then(json => {
                return response.ok ? json : Promise.reject(json);
            });
        })
        .catch(console.error);
    return result;
};

export const wrongSyntax = async (message: Message, text: string) => {
    const msg = await message.channel.send(text);
    if (!message.guild) return;
    msg.delete({ timeout: 1000 * 10 });
    message.delete({ timeout: 1000 * 10 });
};

export const numToMonth = (num: number) => {
    if (num > 11 || num < 0) throw new RangeError('Invalid month, baka.');
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
