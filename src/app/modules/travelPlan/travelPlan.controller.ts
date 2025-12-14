import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { travelPlanService } from "./travelPlan.service";
import { fileUploader } from "../../helpers/fileUpload";
import { get } from "http";
import pick from "../../helpers/pick";

const createTravelPlan = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await travelPlanService.createTravelPlan(
      req as Request & { user: any }
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Travel plan created successfully",
      data: result,
    });
  }
);


const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await travelPlanService.getAllTravelPlans();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All travel plans retrieved successfully",
    data: result,
  });
});


const getMyTravelPlans = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await travelPlanService.getMyTravelPlans(req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My travel plans retrieved successfully",
      data: result,
    });
  }
);


const getSingleTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await travelPlanService.getSingleTravelPlan(
    Number(req.params.id)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Travel plan retrieved successfully",
    data: result,
  });
});



 const updateTravelPlan = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const travelPlanId = Number(req.params.id);
    const userId = req.user?.id;

    if (req.file) {
      const uploadResult = await fileUploader.uploadToCloudinary(req.file);
      req.body.image = uploadResult?.secure_url;
    }


    const result = await travelPlanService.updateTravelPlan({
      userId,
      planId: travelPlanId,
      payload: req.body
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Travel plan updated successfully",
      data: result,
    });
  }
);


const deleteTravelPlan = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await travelPlanService.deleteTravelPlan(
      req.user,
      Number(req.params.id)
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Travel plan deleted successfully",
      data: result,
    });
  }
);


const getFeedTravelPlans = catchAsync(async (req: Request & { user?: any }, res: Response) => {
const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const fillters = pick(req.query,  [
  "destination",
  "startDate",
  "endDate",
  "minBudget",
  "maxBudget",
  "travelType",
  "isActive",
  "latitude",
  "longitude"
])
  const plans = await travelPlanService.getFeedTravelPlans(req.user?.id, options, fillters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All active travel plans retrieved successfully",
    data: plans,
  });
});



const getMatchedTravelPlans = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const loggedInUserId = req.user?.id;
const planId = Number(req.params.planId);
  
  const matched = await travelPlanService.getMatchedTravelPlans(loggedInUserId, planId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Matched travel plans retrieved successfully",
    data: matched,
  });
});



export const travelPlanController = {
  createTravelPlan,
  getAllTravelPlans,
  getMyTravelPlans,
  getSingleTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  getFeedTravelPlans,
  getMatchedTravelPlans
};
