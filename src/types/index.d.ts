// types/express.d.ts
import { JWTPayload } from "./jwtPayload";

declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayload;
  }
}
