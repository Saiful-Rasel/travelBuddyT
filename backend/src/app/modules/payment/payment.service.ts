import { v4 as uuid } from "uuid";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

// @ts-ignore: no type declarations for 'sslcommerz-lts'
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = config.ssl.store_id;
const store_passwd = config.ssl.store_password;
const is_live = false;

console.log(store_id, store_passwd);

const createPayment = async (paymentData: any, user: any) => {
  const { amount } = paymentData;

  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment amount");
  }

  const tranId = uuid();

  try {
    await prisma.payment.create({
      data: {
        userId: user?.id,
        tranId,
        amount: amount,
        status: PaymentStatus.PENDING,
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
    const sslcz = new (SSLCommerzPayment as any)(
      store_id,
      store_passwd,
      is_live,
    );
    console.log(sslcz, "sslcz");
    const apiResponse = await sslcz.init(data);
    console.log(apiResponse);

    return {
      paymentUrl: apiResponse?.GatewayPageURL,
      tranId,
    };
  } catch (error) {
    console.error("Payment creation error:", error);
    throw error;
  }
};

export const paymentService = {
  createPayment,
};
