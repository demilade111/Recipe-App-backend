import { Request } from "express";
import { JWTPayload } from "./jwtPayload";



export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
