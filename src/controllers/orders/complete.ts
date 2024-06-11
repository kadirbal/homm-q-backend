import { prisma } from "@/utils/prisma";
import { PeriodProduct, User } from "@prisma/client";
import { Request, Response } from "express";

type TOrderItem = {
  price: number;
  name: string;
  code: string;
  id: string;
  quantity: number;
};

async function calculateBasketTotal(order: TOrderItem[]) {
  const productsWithPrices = await prisma.productPrice.findMany({
    where: {
      productId: {
        in: order.map((item) => item.id),
      },
    },
  });

  let withCurrentPrices = [];

  for (const iterator of order) {
    const foo = productsWithPrices.find(
      (item) => item.productId === iterator.id
    );

    withCurrentPrices.push(foo.price * iterator.quantity);
  }

  return withCurrentPrices.reduce((acc, value) => acc + value, 0);
}

async function CHECK_JOIN_CAMPAIGN_STATUS(
  user: User,
  basketTotal: number
): Promise<PeriodProduct[]> {
  const activeCampaign = await GET_ACTIVE_CAMPAIGN(),
    USER_CREATED_MONTH = user.createdAt.getMonth() + 1,
    activeCampaignYear = activeCampaign.startDate.getFullYear(),
    activeCampaignMonths = activeCampaign.periods.map((item) => item.month),
    IS_USER_BETWEEN_DATES =
      user.createdAt.getFullYear() === activeCampaignYear &&
      activeCampaignMonths.includes(USER_CREATED_MONTH);

  if (IS_USER_BETWEEN_DATES) {
    const currentMonth = new Date().getMonth() + 1;

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
    });

    const currentPeriod = activeCampaign.periods.find(
      (item) => item.month === currentMonth
    );

    const IS_MINIMUM_BASKET = basketTotal >= currentPeriod.minOrderAmount;

    if (
      USER_CREATED_MONTH === currentPeriod.month &&
      !orders.length &&
      IS_MINIMUM_BASKET
    ) {
      // kayit oldugu perioddaki ilk siparisi
      return currentPeriod.PeriodProduct;
    }

    const previousPeriod = activeCampaign.periods.find(
      (item) => item.month === currentMonth - 1
    );

    const previousPeriodFirstOrder =
      previousPeriod &&
      (await prisma.order.findFirst({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(activeCampaignYear, currentMonth - 1, 1),
            lt: new Date(activeCampaignYear, currentMonth, 0),
          },
        },
      }));

    if (
      previousPeriodFirstOrder &&
      previousPeriodFirstOrder.amount >= previousPeriod.minOrderAmount &&
      IS_MINIMUM_BASKET
    ) {
      return currentPeriod.PeriodProduct;
    }

    return [];
  }

  return [];
}

async function completeOrder(
  req: Request<{}, {}, TOrderItem[]>,
  res: Response
) {
  const user = await prisma.user.findUnique({
      where: { id: req.userID },
    }),
    order = req.body;

  const basketTotal = await calculateBasketTotal(order);

  // const result = checkFreeProducts(user, basketTotal);
  const rawGifts: PeriodProduct[] = await CHECK_JOIN_CAMPAIGN_STATUS(
    user,
    basketTotal
  );

  const orderDbResult = await prisma.order.create({
    data: {
      user: {
        connect: { id: req.userID },
      },
      amount: basketTotal,
      items: {
        create: order.map((item) => ({
          product: {
            connect: { id: item.id },
          },
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  const gifts = await prisma.product.findMany({
    where: {
      id: {
        in: rawGifts.map((item) => item.productId),
      },
    },
  });

  res.status(201).json({
    order: orderDbResult,
    gifts,
  });
}

export { completeOrder };

const GET_ACTIVE_CAMPAIGN = async () => {
  const currentDate = new Date();

  const activeCampaign = await prisma.campaign.findFirst({
    where: {
      startDate: {
        lte: currentDate,
      },
    },
    orderBy: {
      startDate: "asc",
    },
    include: {
      periods: {
        include: {
          PeriodProduct: {
            include: { product: true },
          },
        },
      },
    },
  });

  return activeCampaign;
};
