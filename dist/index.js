"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors"));
const cardRoutes_1 = __importDefault(require("./routes/cardRoutes"));
const adminStats_1 = __importDefault(require("./routes/adminStats"));
const visitLogger_1 = require("./middleware/visitLogger");
const userStats_1 = __importDefault(require("./routes/userStats"));
const adminActivity_1 = __importDefault(require("./routes/adminActivity"));
const support_1 = __importDefault(require("./routes/support"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(visitLogger_1.logVisit);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/cards", cardRoutes_1.default);
app.use("/api", adminStats_1.default);
app.use("/api", userStats_1.default);
app.use("/api", adminActivity_1.default);
app.use("/api", support_1.default);
app.use("/api/auth", authRoutes_1.default);
(0, db_1.default)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
