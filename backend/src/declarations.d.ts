declare module 'express' {
    export interface Request {
        [key: string]: any;
        user?: any;
    }
    export interface Response {
        [key: string]: any;
    }
    export interface NextFunction {
        (err?: any): void;
    }
    const express: any;
    export default express;
}

declare module 'cors';
declare module 'bcryptjs';
declare module 'multer';
declare module 'nodemailer';
declare module 'razorpay';
