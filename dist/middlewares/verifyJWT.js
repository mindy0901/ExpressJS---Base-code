"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.Authorization;
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const decodedUser = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
        req.userId = decodedUser.id;
        req.userRole = decodedUser.role;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid token" });
        }
        else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.default = verifyJWT;
