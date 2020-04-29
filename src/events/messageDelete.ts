import { VenusClient, VenusMessage } from '../interfaces/Client';

export default async (client: VenusClient, message: VenusMessage) => {
    if (message.guild) {
        client.database.reactionRoles.findOneAndDelete({ guild: message.guild.id, message: message.id });
    }
};
