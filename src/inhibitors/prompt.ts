import { Message } from 'discord.js';
import { VenusCommand, VenusClient } from '../interfaces/Client';

export default (message: Message, command: VenusCommand) => {
    const client = message.client as VenusClient;
    const prompt = client.prompts.get(message.author.id);
    const hasPrompt = prompt !== undefined;

    if (!hasPrompt) client.prompts.set(message.author.id, command.name);
    return hasPrompt;
};
