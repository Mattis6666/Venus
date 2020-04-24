import { VenusCommand, VenusClient, VenusMessage } from '../interfaces/Client';

export default (message: VenusMessage, command: VenusCommand) => {
    const client = message.client as VenusClient;
    const prompt = client.prompts.get(message.author.id);
    const hasPrompt = prompt !== undefined;

    if (!hasPrompt) client.prompts.set(message.author.id, command.name);
    return hasPrompt;
};
