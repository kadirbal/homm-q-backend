import { prisma } from "@/utils/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

async function login(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || password !== user.password) {
    res.status(401).json({ message: "Gecersiz email veya parola" });
    return;
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

  res.status(200).json({ token, email: user.email });
}

export { login };
