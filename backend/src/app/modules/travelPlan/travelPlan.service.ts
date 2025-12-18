import httpStatus from "http-status";
import prisma from "../../shared/prisma";
import AppError from "../../errors/appError";
import { Request } from "express";
import { fileUploader } from "../../helpers/fileUpload";
import { IOptions, paginationHelper } from "../../helpers/paginationHelper";
import { Role } from "@prisma/client";

interface UpdateTravelPlanArgs {
  userId: number;
  planId: number;
  payload: any;
}

const createTravelPlan = async (req: Request & { user: any }) => {
  if (!req?.user) throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.image = uploadResult?.secure_url;
  }

  const today = new Date();
  const startDate = new Date(req.body.startDate);
  if (startDate < today) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start date cannot be in the past"
    );
  }

  const endDate = new Date(req.body.endDate);
  if (endDate < startDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date cannot be before start date"
    );
  }
  return await prisma.travelPlan.create({
    data: {
      ...req.body,
      startDate,
      endDate,
      userId: req?.user?.id,
    },
  });
};

const getAllTravelPlans = async () => {
  return await prisma.travelPlan.findMany({
    where: { isActive: true },
    include: {
      user: {
        select: { id: true, fullName: true, profileImage: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getMyTravelPlans = async (user: any) => {
  return await prisma.travelPlan.findMany({
    where: {
      userId: user.id, // আমার travel plan
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },

      // ⭐ ALL MATCH REQUESTS FOR THIS PLAN
      matchRequests: {
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              profileImage: true,
            },
          },
          receiver: {
            select: {
              id: true,
              fullName: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      reviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              fullName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
};
const getSingleTravelPlan = async (id: number) => {
  return await prisma.travelPlan.findUniqueOrThrow({
    where: { id: id },
    include: {
      user: {
        select: { id: true, fullName: true, profileImage: true },
      },
    },
  });
};

const updateTravelPlan = async ({
  userId,
  planId,
  payload,
}: UpdateTravelPlanArgs) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id: planId },
  });
  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }
 if (plan.userId !== userId && Role.ADMIN !== "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot edit this plan");
  }
  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);
  const updatedPlan = await prisma.travelPlan.update({
    where: { id: planId },
    data: payload,
  });

  return updatedPlan;
};

const deleteTravelPlan = async (user: any, planId: number) => {
  const plan = await prisma.travelPlan.findUniqueOrThrow({
    where: { id: planId },
  });
  if (plan.userId !== user.id && user.role !== "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot delete this plan");
  }
  return await prisma.travelPlan.delete({
    where: { id: planId },
  });
};

const getFeedTravelPlans = async (
  userId: number,
  options: IOptions,
  filters: any
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const {
    destination,
    travelType,
    minBudget,
    maxBudget,
    isActive,
    latitude,
    longitude,
    startDate,
    endDate,
  } = filters;

  const whereConditions: any = {
    isActive: true,
    NOT: {
      userId: userId,
    },
  };

  if (isActive !== undefined) {
    whereConditions.isActive = isActive === "true";
  }

  if (destination) {
    whereConditions.destination = {
      contains: destination,
      mode: "insensitive",
    };
  }

  if (startDate || endDate) {
    whereConditions.AND = [
      {
        startDate: {
          lte: endDate ? new Date(endDate) : new Date("9999-12-31"),
        },
      },
      {
        endDate: {
          gte: startDate ? new Date(startDate) : new Date("0001-01-01"),
        },
      },
    ];
  }

  if (minBudget) {
    whereConditions.minBudget = {
      gte: Number(minBudget),
    };
  }

  if (maxBudget) {
    whereConditions.maxBudget = {
      lte: Number(maxBudget),
    };
  }

  if (travelType) {
    whereConditions.travelType = travelType;
  }

  if (latitude) {
    whereConditions.latitude = Number(latitude);
  }

  if (longitude) {
    whereConditions.longitude = Number(longitude);
  }

  const data = await prisma.travelPlan.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: {
        select: { id: true, fullName: true, profileImage: true },
      },
      reviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              fullName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.travelPlan.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getMatchedTravelPlans = async (userId: number, planId: number) => {
  const myPlan = await prisma.travelPlan.findFirst({
    where: { id: planId, userId },
  });

  if (!myPlan) {
    throw new Error("Travel plan not found");
  }

  if (myPlan.startDate > myPlan.endDate) {
    throw new Error("Invalid travel plan dates: startDate is after endDate");
  }
  const baseConditions: any = {
    userId: { not: userId },
    isActive: true,
    destination: { contains: myPlan.destination, mode: "insensitive" },
    travelType: myPlan.travelType,
    AND: [
      { startDate: { lte: myPlan.endDate } },
      { endDate: { gte: myPlan.startDate } },
    ],
    minBudget: { lte: myPlan.maxBudget },
    maxBudget: { gte: myPlan.minBudget },
  };

  const excludedRequests = await prisma.matchRequest.findMany({
    where: { senderId: userId },
    select: { travelPlanId: true },
  });
  const excludeIds = excludedRequests.map((r) => r.travelPlanId);
  if (excludeIds.length > 0) {
    baseConditions.id = { notIn: excludeIds };
  }

  const matchedPlans = await prisma.travelPlan.findMany({
    where: baseConditions,
    include: {
      user: { select: { id: true, fullName: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return matchedPlans;
};

export const travelPlanService = {
  createTravelPlan,
  getAllTravelPlans,
  getMyTravelPlans,
  getSingleTravelPlan,
  updateTravelPlan,
  deleteTravelPlan,
  getMatchedTravelPlans,
  getFeedTravelPlans,
};
