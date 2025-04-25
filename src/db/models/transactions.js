import { model, Schema } from 'mongoose';

const transactionsSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['income', 'expenses'],
            required: true,
        },
        category: {
            type: String,
            enum: [
                'income',
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
        sum: {
            type: Number,
            default: 0,
            required: true
        },
        comment: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const transactionsCollection = model('Transaction', transactionsSchema);
