import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';

export const admin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied',
        });
    }

    next();
};