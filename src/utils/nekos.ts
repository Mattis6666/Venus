import NekoClient from 'nekos.life';
import { NekoSfwImageOptions, NekoNsfwImageOptions } from '../interfaces/NekoOptions';
import { Message, MessageEmbed } from 'discord.js';
import { getMember } from './getters';
const client = new NekoClient();

export const getImage = async (type: NekoSfwImageOptions) => {
    return (await client.sfw[type]())?.url;
};
export const getHentai = async (type: NekoNsfwImageOptions) => {
    return (await client.nsfw[type]())?.url;
};
export const OwOify = async (text: string) => {
    return (await client.sfw.OwOify({ text: text }))?.owo;
};
export const eightball = async () => {
    return await client.sfw['8Ball']({ text: '' });
};
export const fact = async () => {
    return (await client.sfw.fact()).fact;
};
export const spoiler = async (text: string) => {
    return await client.sfw.spoiler({ text: text });
};
export const sendImage = async (message: Message, args: string[], type: NekoSfwImageOptions, description: string) => {
    let member;
    if (args.length) {
        member = await getMember(message, args);
        if (!member) return;
    }

    const url = await getImage(type);
    const output = new MessageEmbed()
        .setTimestamp()
        .setColor('RANDOM')
        .setImage(url)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 256, dynamic: true }));

    if (!member) return message.channel.send(output);
    output.setDescription(description.replace('{{USER}}', message.author.toString()).replace('{{MEMBER}}', member.toString()));
    return message.channel.send(output);
};
