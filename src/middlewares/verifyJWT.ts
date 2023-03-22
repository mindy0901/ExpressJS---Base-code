import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserRequest } from "../types/authTypes";

dotenv.config();

type AuthHeader = string | string[] | undefined;

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: AuthHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader || Array.isArray(authHeader)) {
        return res.status(403).json({ message: "Authorization error" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Bearer token not found" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Invalid authorization header format" });
    }

    const token = parts[1];

    try {
        const decoded: string | JwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret);

        const decodedUser: UserRequest = typeof decoded === "string" ? JSON.parse(decoded) : decoded;

        req.userId = decodedUser.id;
        req.userRole = decodedUser.role;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid token" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

export default verifyJWT;
