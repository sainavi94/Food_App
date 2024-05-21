import mongoose, { Schema, Document, Model, Mongoose } from 'mongoose';

export interface FoodDoc extends Document {
    vandorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: [string];
};

const FoodSchema = new Schema({
    vandorId:{type: String},
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String},
    foodType: {type: String, required: true},
    readyTime: {type: Number},
    price: {type: Number, required: true},
    images: {type: [String]}
},
{
    toJSON: {
        transform(doc,ret) {
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    timestamps: true
});


const Food = mongoose.model<FoodDoc>('food',FoodSchema);

export {Food};