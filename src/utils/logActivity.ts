// utils/logActivity.ts
import Activity from "../models/Activity";

export const logActivity = async ({
  user,
  action,
  details = "",
}: {
  user: string;
  action: string;
  details?: string;
}) => {
  try {
    await Activity.create({ user, action, details });
  } catch (err) {
    console.error("فشل في تسجيل النشاط:", err);
  }
};
