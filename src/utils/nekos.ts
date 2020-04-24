import NekoClient from 'nekos.life';
import { NekoSfwImageOptions, NekoNsfwImageOptions } from '../interfaces/NekoOptions';
import { MessageEmbed, TextChannel } from 'discord.js';
import { getMember } from './getters';
import { VenusMessage } from '../interfaces/Client';
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
export const sendImage = async (message: VenusMessage, args: string[], type: NekoSfwImageOptions, description: string) => {
    let member;
    if (args.length && message.guild) {
        member = await getMember(message, args);
        if (!member) return;
    }

    const url = await getImage(type);
    if (!url) return; // TODO ERROR HERE

    const output = new MessageEmbed()
        .setTimestamp()
        .setColor('RANDOM')
        .setImage(url)
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 256, dynamic: true }));

    if (!member) return message.channel.send(output);

    output.setDescription(`*${description.replace('{{USER}}', `**${message.member!.displayName}**`).replace('{{MEMBER}}', `**${member.displayName}**`)}*`);
    return message.channel.send(output);
};

export const sendHentai = async (message: VenusMessage, type: NekoNsfwImageOptions) => {
    if (!message.guild || !(message.channel as TextChannel).nsfw) return;

    const url = await getHentai(type);
    if (!url) return;

    const output = new MessageEmbed()
        .setTimestamp()
        .setColor('RANDOM')
        .setImage(url)
        .setAuthor(`So naughty, ${message.author.username}~`, message.author.displayAvatarURL({ size: 256, dynamic: true }));

    return message.channel.send(output);
};
