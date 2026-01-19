import { send } from "process";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { Request ,Response} from "express";
import { paymentService } from "./payment.service";

const createPayment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const data = await paymentService.createPayment(req.body, req.user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment session created successfully",
      data: data,
    });
  }
);



export const paymentController = {
  createPayment,

};