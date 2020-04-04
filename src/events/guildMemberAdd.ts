import Canvas from 'canvas';
import VenClient from '../interfaces/Client';
import { GuildMember, TextChannel } from 'discord.js';
import path from 'path';

export default async (_client: VenClient, member: GuildMember) => {
    const channel = member.guild.channels.cache.get('695793033442230362');
    if (!channel) return;

    const background = await Canvas.loadImage(path.join(__dirname, '../../../assets/images/welcome.jpg'));
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ size: 256, format: 'png' }));
    const guild = member.guild.name;
    const name = member.user.tag;

    const canvas = Canvas.createCanvas(1150, 450);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Text Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'magenta');
    gradient.addColorStop(0.5, 'blue');
    gradient.addColorStop(1, 'red');
    ctx.fillStyle = gradient;

    // Member Name
    ctx.font = adjustSize(canvas, name, 330, 20);
    const center = 330 - ctx.measureText(name).width > 0 ? (330 - ctx.measureText(name).width) / 2 : 0;

    ctx.fillText(name, 660 + center, 304);

    // Guild Name
    ctx.font = adjustSize(canvas, guild, 600, 30);

    const center2 = 500 - ctx.measureText(guild).width > 0 ? (500 - ctx.measureText(guild).width) / 2 : 0;

    ctx.fillText(guild, 565 + center2, 390);

    // Member Avatar
    ctx.beginPath();
    ctx.arc(795, 136, 95, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 695, 36, 200, 200);

    return (channel as TextChannel).send(`Welcome to ${guild}, ${member}!`, { files: [canvas.toBuffer()] });
};

const adjustSize = (canvas: Canvas.Canvas, text: string, width: number, height: number) => {
    const ctx = canvas.getContext('2d');

    let fontSize = 70;
    do {
        ctx.font = `${(fontSize -= 5)}px serif`;
    } while (ctx.measureText(text).width > width || ctx.measureText(text).actualBoundingBoxAscent > height);
    return ctx.font;
};
