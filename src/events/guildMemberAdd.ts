import Canvas from 'canvas';
import VenusClient from '../interfaces/Client';
import { GuildMember, TextChannel } from 'discord.js';
import path from 'path';
import { getGuild } from '../database/mongo';
import { replace } from '../utils/Util';
let background: Canvas.Image;

export default async (client: VenusClient, member: GuildMember) => {
    const guildSettings = await getGuild(member.guild.id);
    const strings = client.languages.get(guildSettings.settings.language || 'en_GB')?.find(str => str.command === 'misc')?.strings;
    if (!strings) throw new Error('NO STRINGS - GUILDMEMBERADD');

    if (guildSettings.welcome.autoRole) {
        const role = member.guild.roles.cache.get(guildSettings.welcome.autoRole) || (await member.guild.roles.fetch(guildSettings.welcome.autoRole));
        if (!role) return;

        member.roles.add(role, strings.AUTO_ROLE_REASON).catch(() => null);
    }
    if (guildSettings.welcome.message) {
        member.send(guildSettings.welcome.message).catch(() => null);
    }

    if (guildSettings.channels.welcomeChannel) {
        const channel = member.guild.channels.cache.get(guildSettings.channels.welcomeChannel);
        if (!channel) return;

        if (!background) background = await Canvas.loadImage(path.join(__dirname, '../../../assets/images/welcome.jpg'));
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

        (channel as TextChannel)
            .send(
                replace(strings.WELCOME_MESSAGE, {
                    GUILD: guild,
                    MEMBER: member.toString()
                }),
                { files: [canvas.toBuffer()] }
            )
            .catch(() => null);
    }
};

const adjustSize = (canvas: Canvas.Canvas, text: string, width: number, height: number) => {
    const ctx = canvas.getContext('2d');

    let fontSize = 70;
    do {
        ctx.font = `${(fontSize -= 5)}px arial`;
    } while (ctx.measureText(text).width > width || ctx.measureText(text).actualBoundingBoxAscent > height);
    return ctx.font;
};
