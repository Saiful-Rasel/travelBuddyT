import { v4 as uuid } from "uuid";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
import config from "../../config";

// @ts-ignore: no type declarations for 'sslcommerz-lts'
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = config.ssl.store_id;
const store_passwd = config.ssl.store_password;
const is_live = false; // false = sandbox, true = live

const createPayment = async (paymentData: { amount: number }, user: any) => {
  if (!user) throw new Error("User not found");
  console.log(user,"user")

  const { amount } = paymentData;
  const tranId = uuid();

  await prisma.payment.create({
    data: {
      userId: user.id,
      tranId,
      amount: amount,
      status: PaymentStatus.PENDING,
    },
  });

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${config.backend_url}/api/payment/success?tran_id=${tranId}`,
    fail_url: `${config.backend_url}/api/payment/fail?tran_id=${tranId}`,
    cancel_url: `${config.backend_url}/api/payment/cancel?tran_id=${tranId}`,
    ipn_url: `${config.backend_url}/api/payment/ipn`,
    shipping_method: "Courier",
    product_name: "TravelBuddy Service",
    product_category: "Service",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: user.phone || "01711111111",
    cus_fax: "01711111111",
    ship_name: user.fullName,
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  
  

  const sslcz = new (SSLCommerzPayment as any)(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);


  if (!apiResponse?.GatewayPageURL) {
    throw new Error("Payment URL not received from SSLCommerz");
  }

  return {
    paymentUrl: apiResponse.GatewayPageURL,
    tranId,
  };
};

export const paymentService = {
  createPayment,
};
