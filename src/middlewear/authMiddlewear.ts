// authenticateJWT.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Assuming the JWT payload is of this type, adjust as needed
interface JWTPayload {
  userId: number;
  email: string;
}

interface RequestWithUserRole extends Request {
  user?: JWTPayload;
}

const authenticateJWT =
  () =>
  async (req: RequestWithUserRole, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(" ")[1];
      // console.log(req.headers?.authorization);
      if (!token) {
        return res.status(403).json({ message: "Token not  found" });
      }
      const decodedData = <JWTPayload>jwt.verify(token, '123456789');
      req.user = decodedData;
      // console.log(decodedData);
      return next();
    } catch (e) {
      return res.status(500).json({ e });
    }
  };

export default authenticateJWT;
