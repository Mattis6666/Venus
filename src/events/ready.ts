import VenClient from '../interfaces/Client';
import { logInfo } from '../utils/winston';
import config from '../utils/config';
import { TextChannel } from 'discord.js';

export default async (client: VenClient) => {
    logInfo(`Connected to Discord as ${client.user!.tag} - ${client.user!.id}`);
    logInfo(`Serving ${client.guilds.cache.size} guilds and ${client.channels.cache.size} channels.`);
    logInfo(`Default prefix: ${config.defaultPrefix}`);
    ((await client.channels.fetch(config.infoChannel)) as TextChannel).send(
        `Connected to Discord as ${client.user!.tag} - ${client.user!.id}\nServing ${client.guilds.cache.size} guilds and ${
            client.channels.cache.size
        } channels.\nDefault prefix: ${config.defaultPrefix}`
    );
};
