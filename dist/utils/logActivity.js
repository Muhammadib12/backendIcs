"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
// utils/logActivity.ts
const Activity_1 = __importDefault(require("../models/Activity"));
const logActivity = async ({ user, action, details = "", }) => {
    try {
        await Activity_1.default.create({ user, action, details });
    }
    catch (err) {
        console.error("فشل في تسجيل النشاط:", err);
    }
};
exports.logActivity = logActivity;
