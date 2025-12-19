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
// @ts-ignore: no type declarations for 'sslcommerz-lts'
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = config_1.default.ssl.store_id;
const store_passwd = config_1.default.ssl.store_password;
const is_live = false;
const createPayment = (paymentData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = paymentData;
    const tranId = (0, uuid_1.v4)();
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
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: user.fullName,
        cus_email: user.email,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
    };
    console.log(data);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = yield sslcz.init(data);
    return {
        paymentUrl: apiResponse.GatewayPageURL,
        tranId,
    };
});
exports.paymentService = {
    createPayment,
};
