import { Response } from 'express';
import mongoose from 'mongoose';
import { Cocktail } from '../models/Cocktail';
import { AuthRequest } from '../middleware/auth';

export const createCocktail = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const { name, image, recipe, ingredients } = req.body;

        if (!name || !image || !recipe || !ingredients) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                message: 'At least one ingredient is required',
            });
        }

        const cocktail = await Cocktail.create({
            user: new mongoose.Types.ObjectId(req.user._id),
            name,
            image,
            recipe,
            ingredients,
            published: false,
            ratings: [],
        });

        return res.status(201).json(cocktail);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const getCocktails = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const filter = req.user.role === 'admin' ? {} : { published: true };

        const cocktails = await Cocktail.find(filter)
            .populate('user', 'username displayName avatar')
            .sort({ _id: -1 });

        return res.json(cocktails);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const getMyCocktails = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const cocktails = await Cocktail.find({
            user: req.user._id,
        })
            .populate('user', 'username displayName avatar')
            .sort({ _id: -1 });

        return res.json(cocktails);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};