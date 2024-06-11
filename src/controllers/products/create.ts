import { prisma } from "@/utils/prisma";
import { Request, Response } from "express";

async function create(
  req: Request<
    {},
    {},
    { urun_adi: string; urun_kodu: string; urun_fiyati: number }
  >,
  res: Response
) {
  /* const { urun_adi, urun_kodu, urun_fiyati } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        urun_adi,
        urun_kodu,
      },
    });

    const price = await prisma.productPrice.create({
      data: {
        productId: product.id,
        urun_fiyati,
      },
    });

    res.status(201).json({
      ...product,
      urun_fiyati: price.urun_fiyati,
    });
  } catch (error) {
    console.log(error);
  } */
}

export { create as productCreate };
