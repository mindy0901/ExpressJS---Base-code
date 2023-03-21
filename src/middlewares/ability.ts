import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Action, Subject } from "../types/abilityTypes";

const defineAbilitiesFor = (userRole: string) => {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    if (userRole === "ADMIN" || userRole === "DIRECTOR") {
        can(Action.Manage, Subject.All);
    } else {
        cannot(Action.Read, Subject.User);
    }

    return build();
};

export default defineAbilitiesFor;
