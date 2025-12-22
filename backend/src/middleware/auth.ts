import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // Ensure decoded payload has expected fields
        if (!decoded.phone && !decoded.id) throw new Error();

        const user = await User.findById(decoded.id);
        if (!user) throw new Error();

        if (user.isActive === false) {
            res.status(403).send({ message: 'Account has been blocked. Contact support.' });
            return;
        }

        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ message: 'Please authenticate' });
    }
};

export const owner = (req: Request, res: Response, next: NextFunction) => {
    // console.log(`[Auth Check] User: ${(req as any).user._id}, Role: ${(req as any).user.role}`);
    if ((req as any).user.role !== 'owner') {
        res.status(403).send({ message: 'Access denied. Owner role required.' });
        return;
    }
    next();
};

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    // Alias for owner or separate admin logic if needed later
    return owner(req, res, next);
};
