import { model, Schema } from 'mongoose';

 const transactionsSchema = new Schema(
   {
    type: {
        type: String,
        enum: ['+', '-'],
        required: true,
    },
    category: {
        type: String,
        enum: [
            'main expenses',
            'products',
            'car',
            'self care',
            'child care',
            'household products',
            'education',
            'leisure',
            'entertainment',
            'other expenses',
        ],
        required: true,
    },
    summ: {
        type: Number,
        required: true,
        min: 0
    },
    comments: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true,
    }
},
{
    timestamps: true,
    versionKey: false,
    },
);

export const transactionsCollection = model('Transaction', transactionsSchema);
