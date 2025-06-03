"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getSupportMessages = void 0;
const supportMessageSchema_1 = __importDefault(require("./../models/supportMessageSchema"));
const getSupportMessages = async (req, res) => {
    try {
        const messages = await supportMessageSchema_1.default.find()
            .populate("fromUserId", "username email") // لجلب معلومات المستخدم
            .sort({ createdAt: -1 });
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("فشل في جلب رسائل الدعم:", err);
        res.status(500).json({ error: "שגיאה בטעינת ההודעות" });
    }
};
exports.getSupportMessages = getSupportMessages;
const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const deletedMessage = await supportMessageSchema_1.default.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            res.status(404).json({ error: "הודעה לא נמצאה" });
            return;
        }
        res.status(200).json({ message: "ההודעה נמחקה בהצלחה" });
    }
    catch (e) {
        res.status(500).json({ error: "Error deleting message" });
    }
};
exports.deleteMessage = deleteMessage;
