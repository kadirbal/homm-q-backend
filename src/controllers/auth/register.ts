import { prisma } from "@/utils/prisma";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";

async function register(
  req: Request<
    {},
    {},
    { name: string; surname: string; email: string; password: string }
  >,
  res: Response
) {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const { email, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);

    res.status(200).json({ token, email: user.email });
    
  } catch (error) {
    console.log(error);
  }
}

export { register };
