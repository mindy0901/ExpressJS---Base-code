import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Action, Subject } from "../types/authTypes";

const defineAbilitiesFor = (userRole: string) => {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (userRole === "ADMIN" || userRole === "DIRECTOR") {
        can(Action.Manage, Subject.All);
    } else {
        cannot(Action.ReadAllPublic, Subject.User);
    }

    return build();
};

const verifyAbilities = (action: Action, subject: Subject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1 check if user having role or not
        if (!req?.userRole) return res.status(401).json({ message: "User role missing" });

        const ability = defineAbilitiesFor(req.userRole);

        if (!ability.can(action, subject)) return res.status(401).json({ message: "User permission denied" });

        next();
    };
};

export default verifyAbilities;
