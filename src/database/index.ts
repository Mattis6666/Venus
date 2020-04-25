import mongoose from 'mongoose';
import { config } from '../config';
import { logError, logInfo } from '../utils/winston';
import { guildSettings } from './schemas/GuildSchema';
import { infractions } from './schemas/InfractionSchema';
import { tags } from './schemas/TagSchema';
import { intros } from './schemas/IntroSchema';
import { reactionRoles } from './schemas/ReactionRoleSchema';

mongoose.connect(config.mongoString, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', err => logError(err));

db.once('open', () => logInfo(`Connected to MongoDB Atlas at ${db.name}!`));

export const database = {
    guildSettings: guildSettings,
    reactionRoles: reactionRoles,
    infractions: infractions,
    tags: tags,
    intros: intros
};

export const getGuild = async (guildId: string) => {
    return (await guildSettings.findOne({ guild: guildId })) || (await guildSettings.create({ guild: guildId }));
};

export const resetGuild = async (guildId: string) => {
    return await guildSettings.findOneAndDelete({ guild: guildId });
};

export const getInfractions = async (guildId: string, userId: string) => {
    return await infractions.find({ guild: guildId, user: userId });
};

export const getTags = async (guildId: string) => {
    return (await tags.findOne({ guild: guildId })) || (await tags.create({ guild: guildId }));
};

export const getIntros = async (userId: string) => {
    return (await intros.findOne({ user: userId })) || (await intros.create({ user: userId }));
};
