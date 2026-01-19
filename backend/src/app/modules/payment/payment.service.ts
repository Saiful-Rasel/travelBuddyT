import { v4 as uuid } from "uuid";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
import config from "../../config";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import fetch from "node-fetch";

const store_id = config.ssl.store_id;
const store_passwd = config.ssl.store_password;
const is_live = false;

const initSSLPayment = async (data: Record<string, any>) => {
  const payload = {
    store_id,
    store_passwd,
    ...data,
  };

  const response = await fetch(
    is_live
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(payload as any).toString(),
    },
  );

  const raw = await response.text();

  if (!raw.startsWith("{")) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "SSLCommerz rejected the request (HTML response received)",
    );
  }

  return JSON.parse(raw);
};

const createPayment = async (paymentData: any, user: any) => {
  const { amount } = paymentData;

  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment amount");
  }

  const tranId = uuid();

  await prisma.payment.create({
    data: {
      userId: user.id,
      tranId,
      amount,
      status: PaymentStatus.PENDING,
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

  const sslResponse = await initSSLPayment(data);

  if (!sslResponse?.GatewayPageURL) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to generate SSLCommerz payment URL",
    );
  }

  return {
    paymentUrl: sslResponse.GatewayPageURL,
    tranId,
  };
};

export const paymentService = {
  createPayment,
};
