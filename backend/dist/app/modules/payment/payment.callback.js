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
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const router = (0, express_1.Router)();
/**
 * Success callback
 * SSLCommerz redirects with GET, not POST
 */
router.get("/success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tranId = req.query.tranId;
        if (!tranId)
            return res.status(400).send("tranId is missing");
        const payment = yield prisma_1.default.payment.update({
            where: { tranId },
            data: { status: client_1.PaymentStatus.SUCCESS },
        });
        const user = yield prisma_1.default.user.update({
            where: { id: payment.userId },
            data: { premium: true },
        });
        const accessToken = jwtHelper_1.jwtHelper.generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            premium: user.premium,
        }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
        const refreshToken = jwtHelper_1.jwtHelper.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
        res.cookie("accessToken", accessToken, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60,
        });
        res.cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 90,
        });
        return res.redirect(`https://travel-buddy-t.vercel.app/payment/success?tranId=${tranId}`);
    }
    catch (error) {
        console.error("Payment success error:", error);
        return res.redirect("https://travel-buddy-t.vercel.app/payment/fail");
    }
}));
/**
 * Failed payment
 */
router.get("/fail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.query.tranId;
    if (!tranId)
        return res.status(400).send("tranId missing");
    yield prisma_1.default.payment.update({
        where: { tranId },
        data: { status: client_1.PaymentStatus.FAILED },
    });
    res.redirect(`https://travel-buddy-t.vercel.app/payment/fail?tranId=${tranId}`);
}));
/**
 * Cancelled payment
 */
router.get("/cancel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.query.tranId;
    if (!tranId)
        return res.status(400).send("tranId missing");
    yield prisma_1.default.payment.update({
        where: { tranId },
        data: { status: client_1.PaymentStatus.CANCELLED },
    });
    res.redirect(`https://travel-buddy-t.vercel.app/payment/cancel?tranId=${tranId}`);
}));
exports.default = router;
