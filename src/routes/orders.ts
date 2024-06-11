import { completeOrder } from "@/controllers/orders/complete";
import { authenticationMiddleware } from "@/middlewares/authentication";
import { Router } from "express";

const router = Router();

router.post("/complete", authenticationMiddleware, completeOrder);

export { router as orderRouter };
