// routes/userStats.ts
import express from "express";
import User from "../models/User";

const router = express.Router();

router.get("/admin/user-growth", async (req, res) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const usersByMonth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // أسماء الأشهر بالعبرية من ינואר إلى דצמבר
    const hebrewMonths = [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ];

    // تحويل النتائج إلى تنسيق رسم بياني
    const chartData = Array.from({ length: 12 }, (_, i) => {
      const monthStat = usersByMonth.find((m) => m._id === i + 1);
      return {
        name: hebrewMonths[i],
        users: monthStat ? monthStat.count : 0,
      };
    });

    res.json(chartData);
  } catch (err) {
    console.error("Failed to fetch user growth stats:", err);
    res.status(500).json({ error: "אירעה שגיאה בעת שליפת הנתונים" });
  }
});

export default router;
