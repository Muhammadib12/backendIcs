// controllers/supportController.ts
import { Request, Response } from "express";
import SupportMessage from "./../models/supportMessageSchema";

export const getSupportMessages = async (req: Request, res: Response) => {
  try {
    const messages = await SupportMessage.find()
      .populate("fromUserId", "username email") // لجلب معلومات المستخدم
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("فشل في جلب رسائل الدعم:", err);
    res.status(500).json({ error: "שגיאה בטעינת ההודעות" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const messageId = req.params.messageId;
    const deletedMessage = await SupportMessage.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      res.status(404).json({ error: "הודעה לא נמצאה" });
      return;
    }

    res.status(200).json({ message: "ההודעה נמחקה בהצלחה" });
  } catch (e) {
    res.status(500).json({ error: "Error deleting message" });
  }
};
