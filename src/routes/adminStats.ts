import express from "express";
import User from "../models/User";
import Card from "../models/Card";
import Visit from "../models/Visit";
import {
  blockUser,
  deleteUSersController,
  getAllUsersController,
} from "../controllers/getAllUsersController";
import { verifyToken } from "../middleware/authMiddleware";
import {
  deleteMessage,
  getSupportMessages,
} from "../controllers/supportController";

const router = express.Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Registered Users
    const currentUsers = await User.countDocuments({
      createdAt: { $gte: thisMonth },
    });
    const prevUsers = await User.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth },
    });

    // 2. Active Cards
    const currentCards = await Card.countDocuments({
      createdAt: { $gte: thisMonth },
    });
    const prevCards = await Card.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth },
    });

    // 3. Visits
    const currentVisits = await Visit.countDocuments({
      createdAt: { $gte: thisMonth },
    });
    const prevVisits = await Visit.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth },
    });

    const calcDiff = (curr: number, prev: number) => {
      if (prev === 0) return 100;
      return Number((((curr - prev) / prev) * 100).toFixed(2));
    };

    res.json({
      users: {
        count: currentUsers,
        change: calcDiff(currentUsers, prevUsers),
      },
      cards: {
        count: currentCards,
        change: calcDiff(currentCards, prevCards),
      },
      visits: {
        count: currentVisits,
        change: calcDiff(currentVisits, prevVisits),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ בעת جلب الإحصائيات" });
  }
});
router.get("/admin/property-distribution", async (req, res) => {
  try {
    const distribution = await Card.aggregate([
      {
        $group: {
          _id: "$type", // تأكد أن لديك الحقل type في السكيمة
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(distribution);
  } catch (error) {
    console.error("فشل في إحضار توزيع العقارات:", error);
    res.status(500).json({ error: "فشل في إحضار البيانات" });
  }
});

router.get("/admin/users", getAllUsersController);

router.delete("/admin/users/:id", deleteUSersController);
router.patch("/admin/users/block/:id", blockUser);
router.get("/support/messages", verifyToken, getSupportMessages);
router.delete("/support/messages/:messageId", verifyToken, deleteMessage);

export default router;
