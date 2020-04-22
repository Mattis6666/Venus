import { VenusClient } from '../interfaces/Client';
import { Guild } from 'discord.js';

export default async (client: VenusClient, guild: Guild) => {
    const Ven = await client.users.fetch('265560538937819137');

    Ven.send(`I was just added to ${guild.name} with ${guild.memberCount} members!`);
};
