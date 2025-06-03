"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const Card_1 = __importDefault(require("../models/Card"));
const Visit_1 = __importDefault(require("../models/Visit"));
const getAllUsersController_1 = require("../controllers/getAllUsersController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const supportController_1 = require("../controllers/supportController");
const router = express_1.default.Router();
router.get("/admin/stats", async (req, res) => {
    try {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // 1. Registered Users
        const currentUsers = await User_1.default.countDocuments({
            createdAt: { $gte: thisMonth },
        });
        const prevUsers = await User_1.default.countDocuments({
            createdAt: { $gte: lastMonth, $lt: thisMonth },
        });
        // 2. Active Cards
        const currentCards = await Card_1.default.countDocuments({
            createdAt: { $gte: thisMonth },
        });
        const prevCards = await Card_1.default.countDocuments({
            createdAt: { $gte: lastMonth, $lt: thisMonth },
        });
        // 3. Visits
        const currentVisits = await Visit_1.default.countDocuments({
            createdAt: { $gte: thisMonth },
        });
        const prevVisits = await Visit_1.default.countDocuments({
            createdAt: { $gte: lastMonth, $lt: thisMonth },
        });
        const calcDiff = (curr, prev) => {
            if (prev === 0)
                return 100;
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
    }
    catch (err) {
        res.status(500).json({ error: "حدث خطأ בעת جلب الإحصائيات" });
    }
});
router.get("/admin/property-distribution", async (req, res) => {
    try {
        const distribution = await Card_1.default.aggregate([
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
    }
    catch (error) {
        console.error("فشل في إحضار توزيع العقارات:", error);
        res.status(500).json({ error: "فشل في إحضار البيانات" });
    }
});
router.get("/admin/users", getAllUsersController_1.getAllUsersController);
router.delete("/admin/users/:id", getAllUsersController_1.deleteUSersController);
router.patch("/admin/users/block/:id", getAllUsersController_1.blockUser);
router.get("/support/messages", authMiddleware_1.verifyToken, supportController_1.getSupportMessages);
router.delete("/support/messages/:messageId", authMiddleware_1.verifyToken, supportController_1.deleteMessage);
exports.default = router;
