"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Define middleware function for refresh token authentication
const authenticateRefreshToken = async (req, res, next) => {
    // 1. Extract refresh token from request
    const refreshToken = req?.body?.refresh_token;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }
    // 2. Decrypt refresh token
    const bytes = crypto_js_1.default.AES.decrypt(refreshToken, process.env.CRYPTO_KEY);
    const decryptedRefreshToken = bytes?.toString(crypto_js_1.default.enc.Utf8);
    if (!decryptedRefreshToken) {
        return res.status(401).json({ message: "Refresh token decryption failed" });
    }
    // 3. Verify refresh token and extract user id
    let userId;
    try {
        const decoded = jsonwebtoken_1.default.verify(decryptedRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const decodedToken = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
        userId = decodedToken.id;
    }
    catch (error) {
        return res.status(401).json({ message: "Refresh token verification failed", error: error });
    }
    // 4. Find user in database by user id
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return res.status(401).json({ message: "User not found, refresh token failed" });
    }
    // 5. Check if refresh token matches the one stored in database
    if (user.refresh_token !== refreshToken) {
        return res.status(401).json({ message: "Refresh token does not match" });
    }
    // Save the authenticated user to request object
    req.userId = user.id;
    req.userRole = user.role;
    // Call the next middleware or route handler
    next();
};
exports.default = authenticateRefreshToken;
