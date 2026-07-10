import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedback extends Document {
    email: string;
    message: string;
    timestamp: Date;
}

const FeedbackSchema: Schema = new Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
