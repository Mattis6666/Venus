import mongoose from 'mongoose';

export interface Intro extends mongoose.Document {
    user: string;
    intros: {
        message: string;
        channel: string;
        guild: string;
    }[];
}

const IntroSchema = new mongoose.Schema({
    user: String,
    intros: [
        {
            message: String,
            channel: String,
            guild: String
        }
    ]
});

export const intros = mongoose.model<Intro>('Intros', IntroSchema);
