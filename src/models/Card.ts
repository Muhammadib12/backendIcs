import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: String,
    price: String,
    location: String,
    size: String,
    rooms: Number,
    baths: Number,
    image: String,
    forSale: Boolean,
    datePosted: String,
    features: [String],
    description: String,
    owner: String,
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
