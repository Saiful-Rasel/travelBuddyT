import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { reviewService } from "./reviews.service";
import sendResponse from "../../shared/sendResponse";

// Create review
const createReviewController = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { reviewedId, travelPlanId, rating, comment } = req.body;
    const review = await reviewService.createReview(
      req.user!.id,
      reviewedId,
      travelPlanId,
      rating,
      comment
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully",
      data: review,
    });
  }
);


const getReviewsByTravelPlan = catchAsync(
  async (req: Request, res: Response) => {
    const { travelPlanId } = req.params;
    const reviews = await reviewService.getReviewsByTravelPlan(
      Number(travelPlanId)
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  }
);

const getReviewsForUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const reviews = await reviewService.getReviewsForUser(Number(userId));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User reviews retrieved successfully",
    data: reviews,
  });
});

const updateReviewController = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { reviewId } = req.params;
    const data = req.body;
    const review = await reviewService.updateReview(
      Number(reviewId),
      req.user!.id,
      data
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  }
);

const deleteReviewController = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const { reviewId } = req.params;
    const review = await reviewService.deleteReview(
      Number(reviewId),
      req.user!.id
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  }
);
export const reviewController = {
  createReviewController,
  getReviewsByTravelPlan,
  getReviewsForUser,
  updateReviewController,
  deleteReviewController,
};
