import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { matchRequestService } from "./matchRequest.service";



 const sendRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { travelPlanId, message } = req.body;

    const result = await matchRequestService.sendRequest(req.user.id, travelPlanId, message);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Request sent successfully",
      data: result,
    });
  }
);


 const listRequestsForPlan = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { travelPlanId } = req.params;

    const result = await matchRequestService.getRequestsForTravelPlan(Number(travelPlanId), req.user.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Requests retrieved successfully",
      data: result,
    });
  }
);



 const respondRequest = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { requestId } = req.params;
    const { action } = req.body; 

    const result = await matchRequestService.respondToMatchRequest(
      Number(requestId),
      req.user.id,
      action
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Request ${action.toLowerCase()} successfully`,
      data: result,
    });
  }
);


 const mySentRequests = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await matchRequestService.getMySentRequests(req.user.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My sent requests retrieved successfully",
      data: result,
    });
  }
);

export const matchRequestController = {
  sendRequest,
  listRequestsForPlan,
  respondRequest,
  mySentRequests,
};
