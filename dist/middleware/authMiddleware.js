"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        // البحث عن التوكن في الكوكيز أولاً
        let token = req.cookies?.token;
        // إذا لم يوجد في الكوكيز، ابحث في الهيدر
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return; // استخدم return بدلاً من return res.status()
        }
        // التحقق من صحة التوكن
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // إضافة معلومات المستخدم إلى الطلب
        req.userId = decoded.userId || decoded.id;
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
        return; // استخدم return بدلاً من return res.status()
    }
};
exports.verifyToken = verifyToken;
