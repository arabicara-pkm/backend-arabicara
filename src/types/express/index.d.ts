import { DecodedUser } from "../user.type";
import { Express } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}

export { };