import { Role } from "@prisma/client";

export interface UserRequest {
    id: String;
    role: Role;
}

export enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    ReadAll = "readAll",
    ReadPublicOnly = "readPublicOnly",
    Update = "update",
    Delete = "delete",
}
