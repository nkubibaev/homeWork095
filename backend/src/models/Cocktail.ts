import mongoose, { Model } from 'mongoose';

export interface Ingredient {
    name: string;
    amount: string;
}

export interface Rating {
    userId: mongoose.Types.ObjectId;
    rating: number;
}

export interface CocktailFields {
    user: mongoose.Types.ObjectId;
    name: string;
    image: string;
    recipe: string;
    published: boolean;
    ingredients: Ingredient[];
    ratings: Rating[];
}

const CocktailSchema = new mongoose.Schema<CocktailFields>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        recipe: {
            type: String,
            required: true,
        },
        published: {
            type: Boolean,
            default: false,
            required: true,
        },
        ingredients: [
            {
                name: {
                    type: String,
                    required: true,
                },
                amount: {
                    type: String,
                    required: true,
                },
            },
        ],
        ratings: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
            },
        ],
    },
    {
        versionKey: false,
    },
);

export const Cocktail: Model<CocktailFields> = mongoose.model<CocktailFields>('Cocktail', CocktailSchema);