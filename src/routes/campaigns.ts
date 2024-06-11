import { createCampaign } from "@/controllers/campaigns/create";
import { Router } from "express";

const router = Router();
router.post("/create", createCampaign);

export { router as campaignRouter };
