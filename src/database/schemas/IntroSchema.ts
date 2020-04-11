import mongoose from 'mongoose';

export interface Intros extends mongoose.Document {
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

const Intros = mongoose.model<Intros>('Intros', IntroSchema);
export default Intros;
