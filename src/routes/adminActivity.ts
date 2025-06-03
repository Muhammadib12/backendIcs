// routes/adminActivity.ts
import express from "express";
import Activity from "../models/Activity";

const router = express.Router();

router.get("/admin/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(50);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب النشاطות" });
  }
});

export default router;
