import prisma from "../../shared/prisma";
import AppError from "../../errors/appError";
import httpStatus from "http-status";

const createMatchRequest = async (
  senderId: number,
  travelPlanId: number,
  message?: string
) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
    select: { userId: true },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  // নিজের plan-এ request pathaonot block করা
  if (travelPlan.userId === senderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot send a request to your own travel plan");
  }

  const existing = await prisma.matchRequest.findUnique({
    where: { senderId_travelPlanId: { senderId, travelPlanId } },
  });

  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request already sent");
  }

  return await prisma.matchRequest.create({
    data: {
      senderId,
      receiverId: travelPlan.userId,
      travelPlanId,
      message,
    },
  });
};


 const getRequestsForTravelPlan = async (travelPlanId: number, userId: number) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }
  if (plan.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to view requests");
  }
  return await prisma.matchRequest.findMany({
    where: { travelPlanId },
    include: {
      sender: { select: { id: true, fullName: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};


 const respondToMatchRequest = async (
  requestId: number,
  userId: number,
  action: "ACCEPTED" | "REJECTED"
) => {
  const request = await prisma.matchRequest.findUnique({
    where: { id: requestId },
    include: { travelPlan: true },
  });

  if (!request) throw new AppError(httpStatus.NOT_FOUND, "Request not found");


  if (request.travelPlan.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Not authorized to respond");
  }

  return await prisma.matchRequest.update({
    where: { id: requestId },
    data: { status: action },
  });
};



 const getMySentRequests = async (userId: number) => {
  return await prisma.matchRequest.findMany({
    where: { senderId: userId },
    include: {
      travelPlan: true,
      receiver: { select: { id: true, fullName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};


export const matchRequestService = {
  createMatchRequest,
  getRequestsForTravelPlan,
  respondToMatchRequest,
  getMySentRequests,
};  