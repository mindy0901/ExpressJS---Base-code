import * as dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// const { validationResult } = require("express-validator");

const signup = async (req: Request, res: Response) => {
    // 1 validate signup request
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // 2 check for duplicate username or email in the database
    const { username, password, email, role } = req.body;

    const duplicateName = await prisma.user.findUnique({
        where: { username: username },
    });

    if (duplicateName) return res.status(409).json({ message: "Username already exists" });

    const duplicateEmail = await prisma.user.findUnique({
        where: { email: email },
    });

    if (duplicateEmail) return res.status(409).json({ message: "Email already exists" });

    // 3 create user
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
            username: username,
            email: email,
            password: hashedPassword,
            role: role,
        };

        await prisma.user.create({
            data: data,
        });

        return res.status(201).json({ message: "Account creation successful. Thank you for joining us!" });
    } catch (error: unknown) {
        return res.status(500).json({ message: "Error while creating account, please try again.", error: error });
    }
};

const signin = async (req: Request, res: Response) => {
    // 1 validate signin request
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // 2 find user in database
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { username: username },
    });

    if (!user) return res.status(401).json({ message: "User does not exists" });

    // 3 check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Password does not match" });

    // 4 assign token
    const access_token = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET as Secret, {
        expiresIn: "8h",
    });
    const refresh_token = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET as Secret, {
        expiresIn: "24h",
    });

    // 5 pass access_token to
    res.header("Authorization", `Bearer ${access_token}`);
    res.header("Access-Control-Expose-Headers", "Authorization");

    const encryptedRefreshToken = CryptoJS.AES.encrypt(refresh_token, process.env.CRYPTO_KEY as string).toString();

    await prisma.user.update({
        where: { username: username },
        data: { refresh_token: encryptedRefreshToken },
    });

    return res.status(200).json({ message: `Hello ${username}` });
};

const signout = async (req: Request, res: Response) => {
    if (!req.userId) return res.status(500).json({ message: `User not found` });

    try {
        await prisma.user.update({
            where: { id: req.userId },
            data: { refresh_token: "" },
        });

        res.header("Authorization", "");
        res.header("Access-Control-Expose-Headers", "Authorization");

        return res.status(200).json({ message: "Signout successful" });
    } catch (error: unknown) {
        return res.status(200).json({ message: "Signout failed", error: error });
    }
};

const refreshToken = async (req: Request, res: Response) => {
    const x = req.user;

    // 1 get refresh token from request
    const refreshToken = req?.body?.refresh_token;

    if (!refreshToken) res.status(403).json({ message: "Refresh token not found" });

    // 2 decrypt refresh token
    const bytes = CryptoJS.AES.decrypt(refreshToken, process.env.CRYPTO_KEY as string);

    const decryptedRefreshToken = bytes?.toString(CryptoJS.enc.Utf8);

    if (!decryptedRefreshToken) res.status(403).json({ message: "Refresh token decryption failed" });

    // 3 verify refresh token expired time, get user info
    let userId;
    try {
        const decoded: string | JwtPayload = jwt.verify(
            decryptedRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret
        );
        const decodedToken = typeof decoded === "string" ? JSON.parse(decoded) : decoded;

        userId = decodedToken.id;
    } catch (error: unknown) {
        return res.status(403).json({ message: "Refresh token verification failed", error: error });
    }

    // 4 find user in database by user info
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) res.status(403).json({ message: "User not found, refresh token failed" });

    if (user?.refresh_token !== refreshToken) res.status(403).json({ message: "Refresh token does not match" });

    // 5 create new access & refresh token
    const access_token = jwt.sign({ id: user?.id, role: user?.role }, process.env.ACCESS_TOKEN_SECRET as Secret, {
        expiresIn: "8h",
    });

    const refresh_token = jwt.sign({ id: user?.id }, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: "24h" });

    // 6 encrypt refresh token and update user in database
    const encryptedRefreshToken = CryptoJS.AES.encrypt(refresh_token, process.env.CRYPTO_KEY as string).toString();

    await prisma.user.update({
        where: { id: user?.id },
        data: { refresh_token: encryptedRefreshToken },
    });

    // 7 replace access token at response headers
    res.header("Authorization", `Bearer ${access_token}`);
    res.header("Access-Control-Expose-Headers", "Authorization");

    res.status(200).json(encryptedRefreshToken);
};

export { signup, signin, signout, refreshToken };
