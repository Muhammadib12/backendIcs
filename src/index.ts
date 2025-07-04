import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import cardRoutes from "./routes/cardRoutes";
import adminStatsRouter from "./routes/adminStats";
import { logVisit } from "./middleware/visitLogger";
import userStatsRouter from "./routes/userStats";
import adminActivityRoutes from "./routes/adminActivity";
import supportRoutes from "./routes/support";
import { verifyToken } from "./middleware/authMiddleware";
dotenv.config();

const app = express();




app.use(
  cors({
    origin: "https://frontend-ics-nadlan.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // إضافة PATCH هنا
   
  })
);

app.use(logVisit);
app.use(cookieParser());
app.use(express.json());
app.use("/api/cards", cardRoutes);
app.use("/api", adminStatsRouter);
app.use("/api", userStatsRouter);
app.use("/api", adminActivityRoutes);
app.use("/api", supportRoutes);

app.get("/api/keep-alive", (req, res) => {
  res.status(200).send("OK");
});


app.use("/api/auth", authRoutes);
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
