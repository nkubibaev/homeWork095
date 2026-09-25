import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { randomUUID } from 'crypto';

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            username,
            displayName,
            email,
            avatar,
            password,
        } = req.body;

        if (!username || !displayName || !email || !avatar || !password) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({
                message: 'Username already exists',
            });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                message: 'Email already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            displayName,
            email,
            avatar,
            password: hashedPassword,
        });

        return res.status(201).json({
            _id: user._id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            googleId: user.googleId,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required',
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                message: 'Username or password is incorrect',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Username or password is incorrect',
            });
        }

        const token = randomUUID();

        user.token = token;
        await user.save();

        return res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};