"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUser = exports.deleteUSersController = exports.getAllUsersController = void 0;
const User_1 = __importDefault(require("../models/User"));
const getAllUsersController = async (req, res) => {
    try {
        // Assuming you have a User model to fetch users from the database
        const users = await User_1.default.find({}, "-password -__v"); // Exclude password and version field
        if (!users || users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        res.status(200).json(users);
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllUsersController = getAllUsersController;
const deleteUSersController = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User_1.default.findByIdAndDelete(userId);
        if (!deletedUser) {
            res.status(404).json({ message: "המשתמש לא נמצא" });
            return;
        }
        res.status(200).json({ message: "המשתמש נמחק בהצלחה" });
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUSersController = deleteUSersController;
const blockUser = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // يمكن أن يكون "blocked" أو "active"
    if (!["blocked", "active"].includes(status)) {
        res.status(400).json({ message: "Invalid status value." });
        return;
    }
    try {
        const user = await User_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const actionLabel = status === "blocked" ? "User blocked" : "User unblocked";
        res.status(200).json({
            message: `${actionLabel} successfully`,
            user,
        });
    }
    catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({ message: "Failed to update user status", error });
    }
};
exports.blockUser = blockUser;
