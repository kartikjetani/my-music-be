import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        // console.log("decoded: ", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("err: ", err);
        return res.status(401).json({ message: "Token is not valid" });
    }
};

export default auth;