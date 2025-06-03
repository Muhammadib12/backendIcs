import { Request, Response, NextFunction } from "express";
import Visit from "./../models/Visit";

export const logVisit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userAgent = req.headers["user-agent"]?.toLowerCase() || "";

    // 1. استثناء زيارات من الأدمن (مثلاً بناءً على user-agent أو IP أو لاحقًا JWT)
    if (
      req.originalUrl.startsWith("/api/admin") ||
      req.originalUrl.includes("admin")
    ) {
      return next(); // تجاهل زيارة الأدمن
    }

    // 2. فقط صفحات محددة نسجل لها زيارات
    const trackablePaths = [
      "/",
      "/login",
      "/api/auth/signin",
      "/api/auth/signup",
    ];
    const isTrackable = trackablePaths.some((path) =>
      req.originalUrl.toLowerCase().startsWith(path)
    );

    if (!isTrackable) {
      return next(); // لا نسجل إلا للصفحات المحددة
    }

    // 3. تسجيل الزيارة
    await Visit.create({
      ip: req.ip,
      page: req.originalUrl,
      userAgent,
    });
  } catch (err) {
    console.error("فشل في تسجيل الزيارة:", err);
  }
  next();
};
