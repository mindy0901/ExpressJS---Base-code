import { Role } from "@prisma/client";

export interface UserRequest {
    id: number;
    role: Role;
}

export enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    ReadAll = "readAll",
    ReadAllPublic = "readAllPublic",
    Update = "update",
    Delete = "delete",
}

export enum Subject {
    All = "all",
    User = "user",
    Product = "product",
}
