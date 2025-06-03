import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// تمديد Request interface لإضافة userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as any;

    // إضافة معلومات المستخدم إلى الطلب
    req.userId = decoded.userId || decoded.id;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
    return; // استخدم return بدلاً من return res.status()
  }
};
