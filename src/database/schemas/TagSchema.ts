import mongoose from 'mongoose';

export interface Tags extends mongoose.Document {
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

const Tags = mongoose.model<Tags>('Tags', TagSchema);
export default Tags;
