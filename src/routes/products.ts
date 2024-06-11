import { getProducts } from "@/controllers/products/all";
import { productCreate } from "@/controllers/products/create";
import { Router } from "express";

const router = Router();

router.get("/", getProducts);
router.post("/create", productCreate);
export { router as productRouter };
