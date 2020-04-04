import mongoose from 'mongoose';
import config from '../utils/config';
import Guild from './schemas/GuildSchema';
import { logError, logInfo } from '../utils/winston';

mongoose.connect(config.mongoString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', err => logError(err));

db.once('open', () => logInfo(`Connected to MongoDB Atlas at ${db.name}!`));

export default Guild;

export const getGuild = async (guildId: string) => {
    return (await Guild.findOne({ guildId: guildId })) || (await Guild.create({ guildId: guildId }));
};
