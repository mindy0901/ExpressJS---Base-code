import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();

const getUsers = async (req: Request, res: Response) => {
    try {
        const users: object[] = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                username: true,
                email: true,
            },
        });

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Get users failed" });
    }
};

const getMe = async (req: Request, res: Response) => {
    try {
        const user: object | null = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                username: true,
                email: true,
            },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
};

export { getUsers, getMe };
