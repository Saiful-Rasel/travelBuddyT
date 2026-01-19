import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { newsletterService } from "./newsLetter.service";
import sendResponse from "../../shared/sendResponse";
import AppError from "../../errors/appError";
import { HttpStatus } from "http-status";



const subscribeController = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
    if (!email || typeof email !== "string") {
    throw new AppError(402, "Valid email is required");
  }
  const subscriber = await newsletterService.subscribeNewsletter(email);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Subscribed successfully",
    data: subscriber,
  });
});


const listSubscribersController = catchAsync(async (req: Request & { user?: any }, res: Response) => {

  const subscribers = await newsletterService.getAllSubscribers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscribers retrieved successfully",
    data: subscribers,
  });
});


const deleteSubscriberController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new AppError(402, "Subscriber ID is required");
  }
  const subscriber = await newsletterService.removeSubscriber(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscriber removed successfully",
    data: subscriber,
  });
});

export const newsletterController = {
  subscribeController,
  listSubscribersController,
  deleteSubscriberController,
};
