"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.signout = exports.signin = exports.signup = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// const { validationResult } = require("express-validator");
const signup = async (req, res) => {
    // 1 validate signup request
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // 2 check for duplicate username or email in the database
    const { username, password, email, role } = req.body;
    const duplicateName = await prisma.user.findUnique({
        where: { username: username },
    });
    if (duplicateName)
        return res.status(409).json({ message: "Username already exists" });
    const duplicateEmail = await prisma.user.findUnique({
        where: { email: email },
    });
    if (duplicateEmail)
        return res.status(409).json({ message: "Email already exists" });
    // 3 create user
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
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
    }
    catch (error) {
        return res.status(500).json({ message: "Error while creating account, please try again.", error: error });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    // 1 validate signin request
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // 2 find user in database
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { username: username },
    });
    if (!user)
        return res.status(401).json({ message: "User does not exists" });
    // 3 check password
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: "Password does not match" });
    // 4 assign token
    const access_token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "8h",
    });
    const refresh_token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "24h",
    });
    // 5 pass access_token to
    res.header("Authorization", `Bearer ${access_token}`);
    res.header("Access-Control-Expose-Headers", "Authorization");
    const encryptedRefreshToken = crypto_js_1.default.AES.encrypt(refresh_token, process.env.CRYPTO_KEY).toString();
    await prisma.user.update({
        where: { username: username },
        data: { refresh_token: encryptedRefreshToken },
    });
    return res.status(200).json({ message: `Hello ${username}` });
};
exports.signin = signin;
const signout = async (req, res) => {
    if (!req.userId)
        return res.status(500).json({ message: `User not found` });
    try {
        await prisma.user.update({
            where: { id: req.userId },
            data: { refresh_token: "" },
        });
        res.header("Authorization", "");
        res.header("Access-Control-Expose-Headers", "Authorization");
        return res.status(200).json({ message: "Signout successful" });
    }
    catch (error) {
        return res.status(200).json({ message: "Signout failed", error: error });
    }
};
exports.signout = signout;
const refreshToken = async (req, res) => {
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
    // 5 create new access & refresh token
    const access_token = jsonwebtoken_1.default.sign({ id: user?.id, role: user?.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "8h",
    });
    const refresh_token = jsonwebtoken_1.default.sign({ id: user?.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });
    // 6 encrypt refresh token and update user in database
    const encryptedRefreshToken = crypto_js_1.default.AES.encrypt(refresh_token, process.env.CRYPTO_KEY).toString();
    await prisma.user.update({
        where: { id: user?.id },
        data: { refresh_token: encryptedRefreshToken },
    });
    // 7 replace access token at response headers
    res.header("Authorization", `Bearer ${access_token}`);
    res.header("Access-Control-Expose-Headers", "Authorization");
    res.status(200).json(encryptedRefreshToken);
};
exports.refreshToken = refreshToken;
