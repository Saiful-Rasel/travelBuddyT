"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const ai_service_1 = require("./ai.service");
const checkPremium_1 = require("../../middleware/checkPremium");
const authGuard_1 = __importDefault(require("../../middleware/authGuard"));
const client_1 = require("@prisma/client");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const router = express_1.default.Router();
router.post("/itinerary", (0, authGuard_1.default)(client_1.Role.ADMIN, client_1.Role.USER), checkPremium_1.checkPremium, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body || {};
        if (!payload.days)
            payload.days = 5;
        const plan = yield (0, ai_service_1.generateItinerary)(payload);
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Itinerary generated successfully",
            data: plan,
        });
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ success: false, message: err.message || "Server error" });
    }
}));
exports.aiRoutes = router;
