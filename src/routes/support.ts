// routes/support.ts
import express from "express";
import { Request, Response } from "express";
import { logActivity } from "../utils/logActivity";
import SupportMessage from "./../models/supportMessageSchema";

const router = express.Router();

router.post("/support/message", async (req: Request, res: Response) => {
  const { message, userId, username } = req.body;

  if (!message || !userId || !username) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  try {
    // 🔒 تحقق هل المستخدم أرسل مسبقًا
    const alreadySent = await SupportMessage.findOne({ userId });
    if (alreadySent) {
      res.status(400).json({ error: "You already sent a support request." });
      return;
    }

    // حفظ الرسالة في قاعدة البيانات
    await SupportMessage.create({ userId, username, message });

    // تسجيل في الأنشطة
    await logActivity({
      user: username,
      action: "support-request",
      details: `פניית תמיכה: ${message}`,
    });

    res.status(200).json({ message: "Message sent to admin" });
  } catch (err) {
    console.error("Support message error:", err);
    res.status(500).json({ error: "Failed to send support message" });
  }
});

export default router;
