"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cardSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("Card", cardSchema);
