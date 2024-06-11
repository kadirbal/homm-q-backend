import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { productRouter } from "./routes/products";
import { campaignRouter } from "./routes/campaigns";
import { orderRouter } from "./routes/orders";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;
// const MONGOOSE_URI = process.env.MONGO_URI;

// mongoose.connect(MONGOOSE_URI);

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/campaigns", campaignRouter);
app.use("/orders", orderRouter);

/* app.post("/auth/register", async (req: Request, res: Response) => {
  const name = req.body.name,
    surname = req.body.surname,
    email = req.body.email,
    password = req.body.password;

  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      res
        .status(400)
        .json({ msg: "Bu email adresi ile bir kullanıcı bulunmaktadır." });
      return;
    }
  } catch (error) {
    res.status(500);
  }

  const user = new User({
    name,
    surname,
    email,
    password,
  });

  await user.save();
  res.status(201).json(user);
});

app.post("/products/add", async (req: Request, res: Response) => {
  const urun_adi = req.body.urun_adi,
    urun_kodu = req.body.urun_kodu,
    urun_fiyati = req.body.urun_fiyati;

  const product = new Product({
    urun_adi,
    urun_kodu,
  });

  await product.save();

  const productPrice = new ProductPrice({
    urun_id: product._id as Schema.Types.ObjectId,
    urun_fiyati,
  });

  await productPrice.save();

  return res.json({
    ...product,
    urun_fiyati: productPrice.urun_fiyati,
  });
}); */

app.listen(PORT, () => {
  return `Listen ${PORT}`;
});
