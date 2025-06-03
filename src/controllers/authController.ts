import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { logActivity } from "../utils/logActivity";
import { stat } from "fs";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, tel, name } = req.body;

    if (!username || !email || !password || !tel || !name) {
      res.status(400).json({ message: "All the fields are required!!" });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { tel }] });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedUsername = username.toLowerCase();

    const newUser = new User({
      username: normalizedUsername,
      email,
      password: hashedPassword,
      tel,
      name,
    });

    await newUser.save();

    await logActivity({
      user: newUser.username,
      action: "signup",
      details: "נרשם למערכת",
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          tel: newUser.tel,
          name: newUser.name,
        },
      });
  } catch (e) {
    console.error("Signup error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { username, password, rememberme } = req.body;

  try {
    if (!username || !password) {
      res.status(400).json({ message: "All the fields are required" });
      return;
    }

    const normalizedUsername = username.toLowerCase();
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const tokenExpiry = rememberme ? "7d" : "1h";
    const cookieMaxAge = rememberme
      ? 7 * 24 * 60 * 60 * 1000
      : 1 * 60 * 60 * 1000;

    const token = jwt.sign(
      { userId: user._id, status: user.status },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: tokenExpiry }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: cookieMaxAge,
      })
      .status(200)
      .json({
        message: "Logged in successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          tel: user.tel,
          name: user.name,
          status: user?.status || "active",
        },
      });
  } catch (e) {
    console.error("Signin error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, tel, password, newPassword } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (tel) user.tel = tel;

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Current password is incorrect" });
        return;
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    if (user.username !== "admin1") {
      await logActivity({
        user: user.username,
        action: "update-profile",
        details: "עדכן פרופיל אישי",
      });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (e) {
    console.error("Update profile error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
