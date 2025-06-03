import express, { Request, Response } from "express";
import {
  signup,
  signin,
  logout,
  updateProfile,
} from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";
import User from "../models/User";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.put("/update-profile", verifyToken, updateProfile);

router.get(
  "/check-login",
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ message: "No user ID found in token" });
        return; // استخدم return بدون قيمة
      }

      const user = await User.findById(userId).select(
        "username email tel _id name status"
      );

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
    } catch (error) {
      console.error("Check login error:", error);
      res.status(500).json({ message: "Error checking login" });
    }
  }
);

export default router;
