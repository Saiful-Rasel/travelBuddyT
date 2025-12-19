"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./app/modules/travelPlan/travelPlan.cron");
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const payment_callback_1 = __importDefault(require("./app/modules/payment/payment.callback"));
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://travel-buddy-t.vercel.app",
    ],
    credentials: true,
}));
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.originalUrl);
    next();
});
app.get("/", (req, res) => {
    res.send(" Travel Buddy Started Successfully");
});
app.use("/api/payment", payment_callback_1.default);
app.use("/api", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
