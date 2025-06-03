import { Request, Response } from "express";
import Card from "../models/Card";
import { logActivity } from "../utils/logActivity";
import User from "../models/User";

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cards", error: err });
  }
};

export const addCard = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      location,
      size,
      rooms,
      baths,
      image,
      forSale,
      datePosted,
      features,
      owner,
      type, // تأكد من أن الحقل type موجود في الطلب
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !size ||
      rooms == null ||
      baths == null ||
      !image ||
      forSale == null ||
      !datePosted ||
      !owner ||
      !type // تأكد من أن الحقل type موجود في التحقق
    ) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newCard = new Card({
      title,
      description,
      price,
      location,
      size,
      rooms,
      baths,
      image,
      forSale,
      datePosted,
      features,
      owner,
      type, // تأكد من أن الحقل type موجود في النموذج
    });

    const user = await User.findOne({ username: newCard.owner });

    const savedCard = await newCard.save();
    if (user?.username !== "admin1") {
      await logActivity({
        user: user?.username ?? "",
        action: "create-card",
        details: "פרסם נכס חדש",
      });
    }

    res.status(201).json(savedCard);
  } catch (err) {
    res.status(500).json({ message: "Failed to add card", error: err });
  }
};
