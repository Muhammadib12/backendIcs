"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/adminActivity.ts
const express_1 = __importDefault(require("express"));
const Activity_1 = __importDefault(require("../models/Activity"));
const router = express_1.default.Router();
router.get("/admin/activities", async (req, res) => {
    try {
        const activities = await Activity_1.default.find().sort({ createdAt: -1 }).limit(50);
        res.json(activities);
    }
    catch (err) {
        res.status(500).json({ message: "فشل في جلب النشاطות" });
    }
});
exports.default = router;
