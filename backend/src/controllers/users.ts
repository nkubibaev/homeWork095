import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { randomUUID } from 'crypto';
import { AuthRequest } from '../middleware/auth';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = '350421679088-0o651u0ggm4a9fiv3femamnui5n3r5u3.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

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

export const getMe = async (
    req: AuthRequest,
    res: Response,
) => {
    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    return res.json({
        _id: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role,
        googleId: req.user.googleId,
    });
};

export const googleLogin = async (
    req: Request,
    res: Response,
) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: 'Google credential is required',
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({
                message: 'Invalid Google token',
            });
        }

        const googleId = payload.sub;
        const email = payload.email;

        if (!email) {
            return res.status(400).json({
                message: 'Google account email is required',
            });
        }

        let user = await User.findOne({
            googleId,
        });

        if (!user) {
            user = await User.findOne({
                email,
            });

            if (user) {
                user.googleId = googleId;
            } else {
                user = new User({
                    username: email.split('@')[0],
                    displayName: payload.name || email,
                    email,
                    avatar: payload.picture || '',
                    password: randomUUID(),
                    role: 'user',
                    googleId,
                });
            }
        }

        const token = randomUUID();

        user.token = token;

        await user.save();

        return res.json({
            message: 'Google login successful',
            user: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                googleId: user.googleId,
                token,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: 'Invalid Google credential',
        });
    }
};