"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const visitSchema = new mongoose_1.default.Schema({
    ip: String,
    page: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model("Visit", visitSchema);
