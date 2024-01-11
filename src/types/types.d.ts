// types.d.ts

import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: { [key: string]: any }; // Adjust the type as needed for your user object
  }
}
