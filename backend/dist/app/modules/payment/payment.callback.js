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
const router = (0, express_1.Router)();
router.get("/success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tranId = req.query.tran_id;
        if (!tranId) {
            return res.status(400).send("tran_id is missing");
        }
        const payment = yield prisma_1.default.payment.update({
            where: { tranId },
            data: { status: client_1.PaymentStatus.SUCCESS },
        });
        yield prisma_1.default.user.update({
            where: { id: payment.userId },
            data: { premium: true },
        });
        return res.redirect(`http://localhost:3000/payment/success?tran_id=${tranId}`);
    }
    catch (error) {
        return res.redirect("http://localhost:3000/payment/fail");
    }
}));
router.get("/fail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.query.tran_id;
    if (!tranId)
        return res.status(400).send("tran_id missing");
    yield prisma_1.default.payment.update({
        where: { tranId },
        data: { status: client_1.PaymentStatus.FAILED },
    });
    res.redirect(`http://localhost:3000/payment/fail?tran_id=${tranId}`);
}));
router.get("/cancel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tranId = req.query.tran_id;
    if (!tranId)
        return res.status(400).send("tran_id missing");
    yield prisma_1.default.payment.update({
        where: { tranId },
        data: { status: client_1.PaymentStatus.CANCELLED },
    });
    res.redirect(`http://localhost:3000/payment/cancel?tran_id=${tranId}`);
}));
exports.default = router;
