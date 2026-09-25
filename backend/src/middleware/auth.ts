import { NextFunction, Request, Response } from 'express';
import { User, UserDocument } from '../models/User';

export interface AuthRequest extends Request {
    user?: UserDocument;
}

export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                message: 'Authorization header is required',
            });
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer' || !token) {
            return res.status(401).json({
                message: 'Invalid authorization format',
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid token',
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};