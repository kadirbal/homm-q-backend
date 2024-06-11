import { Schema } from "mongoose";
import { ProductPrice } from "../schemas/Product";

async function getCurrentPrice(id: Schema.Types.ObjectId) {
  /* const currentPriceOfProduct = await ProductPrice.findOne({
    urun_id: id,
  }).sort({ createdAt: -1 });

  return currentPriceOfProduct.urun_fiyati; */
}

export { getCurrentPrice };
