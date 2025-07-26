import { User } from "../generated/prisma";

declare module "express" {
    interface Request {
        user?: User;
    }
}
