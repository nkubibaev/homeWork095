import { Response } from 'express';
import mongoose from 'mongoose';
import { Cocktail } from '../models/Cocktail';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs/promises';
import path from 'path';

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

        const { name, recipe, ingredients } = req.body;

        if (!name || !recipe || !ingredients) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: 'Cocktail image is required',
            });
        }

        let parsedIngredients;

        try {
            parsedIngredients =
                typeof ingredients === 'string'
                    ? JSON.parse(ingredients)
                    : ingredients;
        } catch {
            return res.status(400).json({
                message: 'Invalid ingredients format',
            });
        }

        if (
            !Array.isArray(parsedIngredients) ||
            parsedIngredients.length === 0
        ) {
            return res.status(400).json({
                message: 'At least one ingredient is required',
            });
        }

        const image = `/uploads/cocktails/${req.file.filename}`;

        const cocktail = await Cocktail.create({
            user: req.user._id,
            name,
            image,
            recipe,
            ingredients: parsedIngredients,
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
    _req: Request,
    res: Response,
) => {
    try {
        const cocktails = await Cocktail.find({ published: true })
            .populate('user', 'username displayName avatar')
            .sort({ _id: -1 });

        const result = cocktails.map((cocktail) => {
            const ratingCount = cocktail.ratings.length;

            const ratingAverage =
                ratingCount > 0
                    ? cocktail.ratings.reduce(
                    (sum, rating) => sum + rating.rating,
                    0,
                ) / ratingCount
                    : 0;

            return {
                _id: cocktail._id,
                name: cocktail.name,
                image: cocktail.image,
                recipe: cocktail.recipe,
                published: cocktail.published,
                ingredients: cocktail.ingredients,
                user: cocktail.user,
                ratingCount,
                ratingAverage,
                userRating: null,
            };
        });

        return res.json(result);
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

export const getCocktail = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        const id = req.params.id;

        if (Array.isArray(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        const cocktail = await Cocktail.findById(id)
            .populate('user', 'username displayName avatar');

        if (!cocktail) {
            return res.status(404).json({
                message: 'Cocktail not found',
            });
        }

        if (!cocktail.published) {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Unauthorized',
                });
            }

            const ownerId = cocktail.user instanceof mongoose.Types.ObjectId
                ? cocktail.user
                : (cocktail.user as unknown as { _id: mongoose.Types.ObjectId })._id;

            if (
                req.user.role !== 'admin' &&
                !ownerId.equals(req.user._id)
            ) {
                return res.status(404).json({
                    message: 'Cocktail not found',
                });
            }
        }

        const ratingCount = cocktail.ratings.length;

        const ratingAverage = ratingCount === 0
                ? 0
                : cocktail.ratings.reduce(
                    (sum, item) => sum + item.rating,
                    0,
                ) / ratingCount;

        const userRating = req.user
            ? cocktail.ratings.find(
            (item) => item.userId.equals(req.user!._id),
        )?.rating ?? null
            : null;

        return res.json({
            ...cocktail.toObject(),
            ratingCount,
            ratingAverage,
            userRating,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const deleteCocktail = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const id = req.params.id;

        if (Array.isArray(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        const cocktail = await Cocktail.findById(id);

        if (!cocktail) {
            return res.status(404).json({
                message: 'Cocktail not found',
            });
        }

        if (
            req.user.role !== 'admin' &&
            !cocktail.user.equals(req.user._id)
        ) {
            return res.status(403).json({
                message: 'You can delete only your own cocktails',
            });
        }

        await Cocktail.findByIdAndDelete(id);

        const imagePath = path.join(
            process.cwd(),
            'public',
            cocktail.image.replace('/uploads/', 'uploads/'),
        );

        try {
            await fs.unlink(imagePath);
        } catch (error) {
            console.error('Image deletion error:', error);
        }

        return res.json({
            message: 'Cocktail deleted',
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const publishCocktail = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        const { id } = req.params;

        if (Array.isArray(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        const cocktail = await Cocktail.findById(id);

        if (!cocktail) {
            return res.status(404).json({
                message: 'Cocktail not found',
            });
        }

        cocktail.published = true;

        await cocktail.save();

        return res.json(cocktail);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const getUnpublishedCocktails = async (
    _req: AuthRequest,
    res: Response,
) => {
    try {
        const cocktails = await Cocktail.find({
            published: false,
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

export const rateCocktail = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const id = req.params.id;

        if (Array.isArray(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid cocktail id',
            });
        }

        const { rating } = req.body;

        if (
            typeof rating !== 'number' ||
            rating < 1 ||
            rating > 5 ||
            !Number.isInteger(rating)
        ) {
            return res.status(400).json({
                message: 'Rating must be an integer from 1 to 5',
            });
        }

        const cocktail = await Cocktail.findById(id);

        if (!cocktail) {
            return res.status(404).json({
                message: 'Cocktail not found',
            });
        }

        if (!cocktail.published) {
            return res.status(400).json({
                message: 'You cannot rate an unpublished cocktail',
            });
        }

        const existingRating = cocktail.ratings.find(
            (item) => item.userId.equals(req.user!._id),
        );

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            cocktail.ratings.push({
                userId: req.user._id,
                rating,
            });
        }

        await cocktail.save();

        return res.json({
            message: 'Rating saved',
            rating,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};