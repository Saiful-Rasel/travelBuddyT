import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { newsletterService } from "./newsLetter.service";
import sendResponse from "../../shared/sendResponse";



const subscribeController = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const subscriber = await newsletterService.subscribeNewsletter(email);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Subscribed successfully",
    data: subscriber,
  });
});


const listSubscribersController = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    console.log(req.user);
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
