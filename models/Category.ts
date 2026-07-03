import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
