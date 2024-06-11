import { prisma } from "@/utils/prisma";
import { Request, Response } from "express";

async function getProducts(req: Request, res: Response) {
    try {
        const raw = await prisma.productPrice.findMany({
            select: {
                price: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        });

        const products = raw.map((item) => ({
            price: item.price,
            name: item.product.name,
            code: item.product.code,
            id: item.product.id,
        }));

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
    }
}

export { getProducts };
