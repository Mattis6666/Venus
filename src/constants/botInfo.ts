import Discord from 'discord.js';
import mongoose from 'mongoose';
import typescript from 'typescript';

export const botInfo = {
    name: 'VenusTs',
    version: '1.0',
    creationDate: 'April 2nd 2020',
    dependencies: [
        {
            type: 'Runtime Environment',
            name: 'node.js',
            version: process.version.slice(1),
            url: 'https://nodejs.org/'
        },
        {
            type: 'Programming Language',
            name: 'typescript',
            version: typescript.version,
            url: 'https://www.typescriptlang.org/'
        },
        {
            type: 'Discord Framework',
            name: 'discord.js',
            version: Discord.version,
            url: 'https://discord.js.org/'
        },
        {
            type: 'Database',
            name: 'mongoose',
            version: mongoose.version,
            url: 'https://mongoosejs.com/'
        }
    ],
    github: 'https://github.com/VenusTs/VenusTs',
    issues: 'https://github.com/VenusTs/VenusTs/issues',
    botInvite: 'https://discordapp.com/oauth2/authorize?client_id=692452667183726684&permissions=1580592383&scope=bot',
    supportServer: 'https://discord.gg/p8SqcaD',
    developers: [
        { name: 'Ven', role: 'Creator, Lead Developer', github: 'https://github.com/Mattis6666', discord: '265560538937819137' },
        { name: 'Awakai', role: 'Design, Ideas', github: 'https://github.com/pixache', discord: '361059389731373066' }
    ]
};
