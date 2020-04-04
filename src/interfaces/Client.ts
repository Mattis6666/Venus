import { Collection, Client } from 'discord.js';
import Command from './Command';
import { Guild } from '../database/schemas/GuildSchema';

export default class VenClient extends Client {
    commands: Collection<string, Command> = new Collection();
    guildSettings: Collection<string, Guild> = new Collection();
    languages: Collection<string, object> = new Collection();
}
