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
exports.paymentService = void 0;
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const store_id = config_1.default.ssl.store_id;
const store_passwd = config_1.default.ssl.store_password;
const is_live = false;
const initSSLPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({ store_id,
        store_passwd }, data);
    const response = yield (0, node_fetch_1.default)(is_live
        ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
        : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(payload).toString(),
    });
    const raw = yield response.text();
    if (!raw.startsWith("{")) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "SSLCommerz rejected the request (HTML response received)");
    }
    return JSON.parse(raw);
});
const createPayment = (paymentData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = paymentData;
    if (!amount || amount <= 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payment amount");
    }
    const tranId = (0, uuid_1.v4)();
    yield prisma_1.default.payment.create({
        data: {
            userId: user.id,
            tranId,
            amount,
            status: client_1.PaymentStatus.PENDING,
        },
    });
    const data = {
        total_amount: amount,
        currency: "BDT",
        tran_id: tranId,
        success_url: `https://travelbuddyt-2.onrender.com/api/payment/success?tranId=${tranId}`,
        fail_url: `https://travelbuddyt-2.onrender.com/api/payment/fail?tranId=${tranId}`,
        cancel_url: `https://travelbuddyt-2.onrender.com/api/payment/cancel?tranId=${tranId}`,
        ipn_url: `https://travelbuddyt-2.onrender.com/api/payment/ipn?tranId=${tranId}`,
        shipping_method: "NO",
        product_name: "Membership",
        product_category: "Service",
        product_profile: "general",
        emi_option: 0,
        cus_name: user.fullName || "Test User",
        cus_email: user.email,
        cus_add1: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01700000000",
    };
    const sslResponse = yield initSSLPayment(data);
    if (!(sslResponse === null || sslResponse === void 0 ? void 0 : sslResponse.GatewayPageURL)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to generate SSLCommerz payment URL");
    }
    return {
        paymentUrl: sslResponse.GatewayPageURL,
        tranId,
    };
});
exports.paymentService = {
    createPayment,
};
