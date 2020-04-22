import { VenusClient } from '../interfaces/Client';
import { logInfo } from '../utils/winston';
import { TextChannel } from 'discord.js';

export default async (client: VenusClient) => {
    logInfo(`Connected to Discord as ${client.user!.tag} - ${client.user!.id}`);
    logInfo(`Serving ${client.guilds.cache.size} guilds and ${client.channels.cache.size} channels.`);
    logInfo(`Default prefix: ${client.config.defaultPrefix}`);

    const infoChannel = client.channels.cache.get(client.config.infoChannel) || (await client.channels.fetch(client.config.infoChannel));
    if (!infoChannel || !(infoChannel instanceof TextChannel)) throw new Error('Invalid Info channel');

    infoChannel.send(
        `Connected to Discord as ${client.user!.tag} - ${client.user!.id}\nServing ${client.guilds.cache.size} guilds and ${
            client.channels.cache.size
        } channels.\nDefault prefix: ${client.config.defaultPrefix}`
    );
};
