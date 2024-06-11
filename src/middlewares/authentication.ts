import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
  req.userID = payload.id;

  next();
}

export { authenticationMiddleware };
