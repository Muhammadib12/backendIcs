"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post("/signup", authController_1.signup);
router.post("/signin", authController_1.signin);
router.post("/logout", authController_1.logout);
router.put("/update-profile", authMiddleware_1.verifyToken, authController_1.updateProfile);
router.get("/check-login", authMiddleware_1.verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "No user ID found in token" });
            return; // استخدم return بدون قيمة
        }
        const user = await User_1.default.findById(userId).select("username email tel _id name status");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return; // استخدم return بدون قيمة
        }
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                tel: user.tel,
                name: user.name,
                status: user.status || "active",
            },
        });
    }
    catch (error) {
        console.error("Check login error:", error);
        res.status(500).json({ message: "Error checking login" });
    }
});
exports.default = router;
