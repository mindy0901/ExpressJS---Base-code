import { Role } from "@prisma/client";
import { DecodedUser } from "jwtTypes";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production" | "test";
            API_BASE_URL: string;
            API_TIMEOUT: number;
        }
    }

    namespace Express {
        interface Request {
            user: DecodedUser;
            userId: number | undefined;
            userRole: Role;
        }

        interface Response {}
    }
}
