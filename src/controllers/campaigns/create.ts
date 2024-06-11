import { prisma } from "@/utils/prisma";
import { Request, Response } from "express";

type TPeriod = {
  gifts: string[];
  minOrderAmount: string;
  month: number;
}

type TCampaign = {
  name: string;
  periods: TPeriod[];
  startDate: string;
};

async function createCampaign(req: Request<{}, {}, TCampaign>, res: Response) {
  const { name, startDate, periods } = req.body;

  const camp = await prisma.campaign.create({
    data: {
      name,
      startDate: new Date(startDate),
      periods: {
        create: periods.map((period) => ({
          minOrderAmount: parseFloat(period.minOrderAmount),
          month: period.month,
          PeriodProduct: {
            create: period.gifts.map((id) => ({
              product: {
                connect: { id },
              },
            })),
          },
        })),
      },
    },
  });

  res.status(200).json(camp);
}

export { createCampaign };
