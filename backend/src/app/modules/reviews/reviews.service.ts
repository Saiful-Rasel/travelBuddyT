import AppError from "../../errors/appError";
import httpStatus from "http-status";
import prisma from "../../shared/prisma";

  const createReview = async (
    reviewerId: number,
    reviewedId: number,
    travelPlanId: number,
    rating: number,
    comment?: string
  ) => {
    if (reviewerId === reviewedId) {
      throw new AppError(httpStatus.BAD_REQUEST, "You cannot review yourself");
    }

    const match = await prisma.matchRequest.findFirst({
      where: {
        travelPlanId,
        senderId: reviewerId,
        status: "ACCEPTED",
      },
    });

    if (!match) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not allowed to review this travel plan"
      );
    }
    const existing = await prisma.review.findFirst({
      where: { reviewerId, travelPlanId },
    });

    if (existing) {
      throw new AppError(httpStatus.BAD_REQUEST, "Review already exists");
    }
      const plan = await prisma.travelPlan.findUnique({ where: { id: travelPlanId } });
    if (!plan) {
      throw new AppError(httpStatus.BAD_REQUEST, "Travel plan not found");
    }
    if (plan.isActive) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You can review only after the plan ends"
      );
    }

    return await prisma.review.create({
      data: {
        reviewerId,
        reviewedId,
        travelPlanId,
        rating,
        comment,
      },
    });
  };

const getReviewsByTravelPlan = async (travelPlanId: number) => {
  return await prisma.review.findMany({
    where: { travelPlanId },
    include: {
      reviewer: { select: { id: true, fullName: true, profileImage: true } },
      reviewed: { select: { id: true, fullName: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getReviewsForUser = async (userId: number) => {
  console.log("review",userId)
  return await prisma.review.findMany({
    where: { reviewedId: userId },
    include: {
      reviewer: { select: { id: true, fullName: true, profileImage: true } },
      travelPlan: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateReview = async (
  reviewId: number,
  reviewerId: number,
  data: { rating?: number; comment?: string }
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.reviewerId !== reviewerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Not allowed to update this review"
    );
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data,
  });
};

const deleteReview = async (reviewId: number, reviewerId: number) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.reviewerId !== reviewerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Not allowed to delete this review"
    );
  }

  return await prisma.review.delete({ where: { id: reviewId } });
};

export const reviewService = {
  createReview,
  getReviewsByTravelPlan,
  getReviewsForUser,
  updateReview,
  deleteReview,
};
