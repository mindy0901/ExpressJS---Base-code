import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Action,  UserRequest } from "abilityTypes";

const defineAbilitiesFor = (user: UserRequest) => {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    if (user.role === "ADMIN" || user.role === "DIRECTOR") {
        can(Action.Manage, "all");
    } else {
        can(Action.Read, "post");
    }

    return build();
};

export default defineAbilitiesFor;
