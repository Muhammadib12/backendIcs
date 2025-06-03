import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tel: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: false },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"], // فقط هذه القيم المسموحة
      default: "active", // الحالة الافتراضية عند إنشاء مستخدم جديد
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
