import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import defineAbilitiesFor from "./ability";

const verifyRoles = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1 check if user having role or not
        if (!req?.userRole) return res.status(401).json({ message: "User role missing" });

        // 2 check if user role exists in allowedRoles
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.userRole);
        if (!result) return res.status(401).json({ message: "User permission denied" });

        // const { can } = defineAbilitiesFor(req.userRole);
        // const { action, subject } = req.params; // Get action and subject from request params
        // const isAuthorized = can(action, subject); // Check if user is authorized for action on subject

        // if (!isAuthorized) return res.status(403).json({ message: "User not authorized" });

        // If user is authorized, continue to next middleware
        next();
    };
};

export default verifyRoles;
