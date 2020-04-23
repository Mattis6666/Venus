import mongoose from 'mongoose';

export interface Tag extends mongoose.Document {
    guild: string;
    tags: {
        trigger: string;
        response: string;
        embed: boolean;
        author: { id: string; tag: string };
    }[];
}

const TagSchema: mongoose.Schema = new mongoose.Schema({
    guild: String,
    tags: [
        {
            trigger: String,
            response: Object || String,
            embed: Boolean,
            author: {
                id: String,
                tag: String
            }
        }
    ]
});

export const tags = mongoose.model<Tag>('Tags', TagSchema);
