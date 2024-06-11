import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userID?: string;
    }
  }
}

interface JwtPayload {
  id: number;
}
