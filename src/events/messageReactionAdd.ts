import { VenusClient } from '../interfaces/Client';
import { MessageReaction, User } from 'discord.js';

export default async (_client: VenusClient, reaction: MessageReaction, _user: User) => {
    if (reaction.partial) reaction = await reaction.fetch();
};
