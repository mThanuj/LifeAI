declare namespace Express {
    export interface Request {
        user?: import("../generated/prisma").User;
        isAuthenticated(): boolean;
    }
}
