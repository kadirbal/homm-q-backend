import { Schema, model } from "mongoose";

interface UserDocument extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  hasCampaignBenefit: boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    hasCampaignBenefit: { type: Boolean, default: false },
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

const User = model("User", userSchema);

export { User };
