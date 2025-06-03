// models/SupportMessage.ts
import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromUsername: { type: String, required: true },
    toAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("SupportMessage", supportMessageSchema);
