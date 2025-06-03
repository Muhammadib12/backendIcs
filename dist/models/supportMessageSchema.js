"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/SupportMessage.ts
const mongoose_1 = __importDefault(require("mongoose"));
const supportMessageSchema = new mongoose_1.default.Schema({
    fromUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fromUsername: { type: String, required: true },
    toAdminId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("SupportMessage", supportMessageSchema);
