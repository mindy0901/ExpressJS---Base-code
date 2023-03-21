import { Role } from "@prisma/client";

export interface DecodedUser {
    id: number;
    role: Role;
}
