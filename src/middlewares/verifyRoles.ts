import { NextFunction, Response } from "express";
import { Role } from "@prisma/client";
import { RequestUser } from "./verifyJWT";

const verifyRoles = (...allowedRoles: Role[]) => {
    return (req: RequestUser, res: Response, next: NextFunction) => {
        // 1 check if user having role or not
        if (!req?.userRole) return res.status(401).json({ message: "User role missing" });

        // 2 check if user role exists in allowedRoles
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.userRole);
        if (!result) return res.status(401).json({ message: "User permission denied" });
        next();
    };
};

export default verifyRoles;
