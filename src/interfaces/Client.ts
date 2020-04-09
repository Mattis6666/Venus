import { Collection, Client } from 'discord.js';
import Command from './Command';
import { Guild } from '../database/schemas/GuildSchema';
import Strings from './StringsObj';
import Config from './Config';

export default class VenusClient extends Client {
    commands: Collection<string, Command> = new Collection();
    guildSettings: Collection<string, Guild> = new Collection();
    languages: Collection<string, Strings[]> = new Collection();
    config!: Config;
}
