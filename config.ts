import Config from './src/interfaces/Config';

export const config: Config = {
    token: process.env.TOKEN!,
    mongoString: process.env.MONGO!,
    defaultPrefix: 'v!',
    developers: ['265560538937819137'],
    infoChannel: '695788181970223144',
    errorChannel: '695788085681586273',
    imageChannel: '695788103373291600',
    apiKeys: {
        imgur: {
            id: process.env.IMGUR_ID!,
            secret: process.env.IMGUR_SECRET!
        }
    }
};
