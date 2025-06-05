// routes/support.ts
import express from "express";
import { Request, Response } from "express";
import { logActivity } from "../utils/logActivity";
import SupportMessage from "./../models/supportMessageSchema";

const router = express.Router();

router.post("/support/message", async (req: Request, res: Response) => {
  console.log("=== Support Request Started ===");
  console.log("Request body:", req.body);
  
  const { message, userId, username } = req.body;
  
  if (!message || !userId || !username) {
    console.log("Missing fields:", { message: !!message, userId: !!userId, username: !!username });
    return res.status(400).json({ error: "Missing fields" });
  }
  
  try {
    console.log("Step 1: Checking for existing support message...");
    // 🔒 تحقق هل المستخدم أرسل مسبقًا
    const alreadySent = await SupportMessage.findOne({ userId });
    console.log("Existing message check result:", !!alreadySent);
    
    if (alreadySent) {
      console.log("User already sent support request");
      return res.status(400).json({ error: "You already sent a support request." });
    }
    
    console.log("Step 2: Creating new support message...");
    // حفظ الرسالة في قاعدة البيانات
    const newMessage = await SupportMessage.create({ userId, username, message });
    console.log("Support message created:", newMessage._id);
    
    console.log("Step 3: Logging activity...");
    // تسجيل في الأنشطة
    await logActivity({
      user: username,
      action: "support-request",
      details: `פניית תמיכה: ${message}`,
    });
    console.log("Activity logged successfully");
    
    console.log("=== Support Request Completed Successfully ===");
    return res.status(200).json({ message: "Message sent to admin" });
    
  } catch (err) {
    console.error("=== SUPPORT MESSAGE ERROR ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Error name:", err.name);
    console.error("Full error object:", err);
    console.error("=== END ERROR DETAILS ===");
    
    return res.status(500).json({ error: "Failed to send support message" });
  }
});

export default router;
