"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ability_1 = require("@casl/ability");
const authTypes_1 = require("../types/authTypes");
const defineAbilitiesFor = (userRole) => {
    const { can, cannot, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
    if (userRole === "ADMIN" || userRole === "DIRECTOR") {
        can(authTypes_1.Action.Manage, authTypes_1.Subject.All);
    }
    else {
        cannot(authTypes_1.Action.Read, authTypes_1.Subject.User);
    }
    return build();
};
const verifyAbilities = (action, subject) => {
    return (req, res, next) => {
        // 1 check if user having role or not
        if (!req?.userRole)
            return res.status(401).json({ message: "User role missing" });
        const ability = defineAbilitiesFor(req.userRole);
        if (!ability.can(action, subject))
            return res.status(401).json({ message: "User permission denied" });
        next();
    };
};
exports.default = verifyAbilities;
