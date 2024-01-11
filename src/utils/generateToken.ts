import { randomBytes } from "crypto";

export const generateToken = (size: number = 64): string => {
  return randomBytes(size).toString("hex");
};