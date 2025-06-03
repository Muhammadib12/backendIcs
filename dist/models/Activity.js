"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Activity.ts
const mongoose_1 = __importDefault(require("mongoose"));
const activitySchema = new mongoose_1.default.Schema({
    user: { type: String, required: true }, // username
    action: { type: String, required: true }, // login, signup, etc.
    details: { type: String }, // وصف إضافي
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Activity", activitySchema);
