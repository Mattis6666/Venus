import mongoose from 'mongoose';
import config from '../utils/config';
import Guilds from './schemas/GuildSchema';
import { logError, logInfo } from '../utils/winston';
import Infractions from './schemas/InfractionSchema';

mongoose.connect(config.mongoString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', err => logError(err));

db.once('open', () => logInfo(`Connected to MongoDB Atlas at ${db.name}!`));

export default {
    Guilds,
    Infractions
};

export const getGuild = async (guildId: string) => {
    return (await Guilds.findOne({ guild: guildId })) || (await Guilds.create({ guild: guildId }));
};

export const resetGuild = async (guildId: string) => {
    return await Guilds.findOneAndDelete({ guild: guildId });
};

export const getInfractions = async (guildId: string) => {
    return (await Infractions.findOne({ guild: guildId })) || (await Infractions.create({ guild: guildId }));
};
