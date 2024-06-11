import { Schema, model, Document } from "mongoose";

interface ProductDocument extends Document {
  urun_adi: string;
  urun_kodu: string;
}

interface ProductPriceDocument extends Document {
  urun_id: Schema.Types.ObjectId;
  urun_fiyati: number;
  tarih: Date;
}

const productPriceSchema = new Schema<ProductPriceDocument>(
  {
    urun_id: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    urun_fiyati: { type: Number, required: true },
  },
  {
    collection: "ProductPrices",
    timestamps: true,
  }
);

const productSchema = new Schema<ProductDocument>(
  {
    urun_adi: { type: String, required: true },
    urun_kodu: { type: String, required: true, default: "UK123" },
  },
  {
    collection: "Products",
  }
);

const Product = model<ProductDocument>("Product", productSchema);

const ProductPrice = model<ProductPriceDocument>(
  "ProductPrices",
  productPriceSchema
);

export { Product, ProductPrice };
