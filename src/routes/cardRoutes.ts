import express from "express";
import { getAllCards, addCard } from "../controllers/cardController";

const router = express.Router();

router.get("/", getAllCards);
router.post("/addCard", addCard);

export default router;
