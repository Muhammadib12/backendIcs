// models/Activity.ts
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // username
    action: { type: String, required: true }, // login, signup, etc.
    details: { type: String }, // وصف إضافي
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
