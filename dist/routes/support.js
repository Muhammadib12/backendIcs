"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/support.ts
const express_1 = __importDefault(require("express"));
const logActivity_1 = require("../utils/logActivity");
const supportMessageSchema_1 = __importDefault(require("./../models/supportMessageSchema"));
const router = express_1.default.Router();
router.post("/support/message", async (req, res) => {
    const { message, userId, username } = req.body;
    if (!message || !userId || !username) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }
    try {
        // 🔒 تحقق هل المستخدم أرسل مسبقًا
        const alreadySent = await supportMessageSchema_1.default.findOne({ userId });
        if (alreadySent) {
            res.status(400).json({ error: "You already sent a support request." });
            return;
        }
        // حفظ الرسالة في قاعدة البيانات
        await supportMessageSchema_1.default.create({ userId, username, message });
        // تسجيل في الأنشطة
        await (0, logActivity_1.logActivity)({
            user: username,
            action: "support-request",
            details: `פניית תמיכה: ${message}`,
        });
        res.status(200).json({ message: "Message sent to admin" });
    }
    catch (err) {
        console.error("Support message error:", err);
        res.status(500).json({ error: "Failed to send support message" });
    }
});
exports.default = router;
