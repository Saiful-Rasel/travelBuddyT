import { v4 as uuid } from "uuid";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
import config from "../../config";

// @ts-ignore: no type declarations for 'sslcommerz-lts'
const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = config.ssl.store_id;
const store_passwd = config.ssl.store_password;
const is_live = false;



const createPayment = async (paymentData: any, user: any) => {
  const { amount } = paymentData;
  const tranId = uuid();
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
    tran_id: tranId, // use unique tran_id for each api call
    success_url: `http://localhost:3030/payment/success?tran_id=${tranId}`,
    fail_url: `http://localhost:3030/payment/fail?tran_id=${tranId}`,
    cancel_url: `http://localhost:3030/payment/cancel?tran_id=${tranId}`,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: user.name,
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

  const sslcz = new (SSLCommerzPayment as any)(store_id, store_passwd, is_live);
  const apiResponse = await sslcz.init(data);

  return {
    paymentUrl: apiResponse.GatewayPageURL,
    tranId,
  };
};

export const paymentService = {
  createPayment,
};
