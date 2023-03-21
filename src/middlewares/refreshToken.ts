import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define middleware function for refresh token authentication
const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract refresh token from request
    const refreshToken = req?.body?.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    // 2. Decrypt refresh token
    const bytes = CryptoJS.AES.decrypt(refreshToken, process.env.CRYPTO_KEY as string);

    const decryptedRefreshToken = bytes?.toString(CryptoJS.enc.Utf8);

    if (!decryptedRefreshToken) {
        return res.status(401).json({ message: "Refresh token decryption failed" });
    }

    // 3. Verify refresh token and extract user id
    let userId;
    try {
        const decoded: string | JwtPayload = jwt.verify(
            decryptedRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret
        );
        const decodedToken = typeof decoded === "string" ? JSON.parse(decoded) : decoded;

        userId = decodedToken.id;
    } catch (error: unknown) {
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
    req.user = user;

    // Call the next middleware or route handler
    next();
};

export default authenticateRefreshToken;
