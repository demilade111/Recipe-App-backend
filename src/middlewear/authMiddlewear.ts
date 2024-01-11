// authenticateJWT.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";

// Assuming the JWT payload is of this type, adjust as needed
interface JWTPayload {
  userId: number;
  email: string;
  // add other properties as per your payload structure
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new CustomError(403, "Missing token please provide a token");
  }

  jwt.verify(
    token,
    "1234567890",
    (err, decoded) => {
      if (err) {
        throw new CustomError(400, "Invalid token");
      }

      // Assuming JWTPayload is your payload type
      req.user = decoded as JWTPayload;

      next();
    }
  );
};

export default authenticateJWT;
