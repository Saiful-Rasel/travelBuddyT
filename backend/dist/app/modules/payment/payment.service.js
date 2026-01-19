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
// @ts-ignore: no type declarations for 'sslcommerz-lts'
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = config_1.default.ssl.store_id;
const store_passwd = config_1.default.ssl.store_password;
const is_live = false;
console.log(store_id, store_passwd);
const createPayment = (paymentData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = paymentData;
    if (!amount || amount <= 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid payment amount");
    }
    const tranId = (0, uuid_1.v4)();
    try {
        yield prisma_1.default.payment.create({
            data: {
                userId: user === null || user === void 0 ? void 0 : user.id,
                tranId,
                amount: amount,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        const data = {
            total_amount: amount,
            currency: "BDT",
            tran_id: tranId,
            success_url: `https://travelbuddyt-2.onrender.com/api/payment/success?tran_id=${tranId}`,
            fail_url: `https://travelbuddyt-2.onrender.com/api/payment/fail?tran_id=${tranId}`,
            cancel_url: `https://travelbuddyt-2.onrender.com/api/payment/cancel?tran_id=${tranId}`,
            ipn_url: "https://travelbuddyt-2.onrender.com/ipn",
            shipping_method: "N/A",
            product_name: "Premium Membership",
            product_category: "Service",
            product_profile: "general",
            cus_name: user.fullName,
            cus_email: user.email,
            cus_add1: user.currentLocation || "N/A",
            cus_add2: user.currentLocation || "N/A",
            cus_city: user.currentLocation || "Dhaka",
            cus_state: user.currentLocation || "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: "01700000000",
            cus_fax: "01700000000",
            ship_name: user.fullName,
            ship_add1: user.currentLocation || "N/A",
            ship_add2: user.currentLocation || "N/A",
            ship_city: user.currentLocation || "Dhaka",
            ship_state: user.currentLocation || "Dhaka",
            ship_postcode: 1000,
            ship_country: "Bangladesh",
        };
        console.log(data, "data");
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        console.log(sslcz, "sslcz");
        const apiResponse = yield sslcz.init(data);
        console.log(apiResponse);
        return {
            paymentUrl: apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.GatewayPageURL,
            tranId,
        };
    }
    catch (error) {
        console.error("Payment creation error:", error);
        throw error;
    }
});
exports.paymentService = {
    createPayment,
};
