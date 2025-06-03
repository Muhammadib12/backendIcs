"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCard = exports.getAllCards = void 0;
const Card_1 = __importDefault(require("../models/Card"));
const logActivity_1 = require("../utils/logActivity");
const User_1 = __importDefault(require("../models/User"));
const getAllCards = async (req, res) => {
    try {
        const cards = await Card_1.default.find();
        res.status(200).json(cards);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch cards", error: err });
    }
};
exports.getAllCards = getAllCards;
const addCard = async (req, res) => {
    try {
        const { title, description, price, location, size, rooms, baths, image, forSale, datePosted, features, owner, type, // تأكد من أن الحقل type موجود في الطلب
         } = req.body;
        // التحقق من الحقول المطلوبة
        if (!title ||
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
        const newCard = new Card_1.default({
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
        const user = await User_1.default.findOne({ username: newCard.owner });
        const savedCard = await newCard.save();
        if (user?.username !== "admin1") {
            await (0, logActivity_1.logActivity)({
                user: user?.username ?? "",
                action: "create-card",
                details: "פרסם נכס חדש",
            });
        }
        res.status(201).json(savedCard);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to add card", error: err });
    }
};
exports.addCard = addCard;
