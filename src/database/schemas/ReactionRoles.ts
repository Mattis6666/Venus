import { Document, Schema, model } from 'mongoose';

export interface ReactionRole extends Document {
    guild: string;
    channel: string;
    message: string;
    emojis: { emoji: string; role: string }[];
}

const ReactionRoleSchema = new Schema({
    guild: String,
    channel: String,
    message: String,
    emojis: [
        {
            emoji: String,
            role: String
        }
    ]
});

export const reactionRoles = model<ReactionRole>('reactionRoles', ReactionRoleSchema);
