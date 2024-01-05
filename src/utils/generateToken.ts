import crypto from "crypto";
import jwt from "jsonwebtoken";

import { randomBytes } from "crypto";

export const generateVerificationToken = (size: number = 64): string => {
  return randomBytes(size).toString("hex");
};