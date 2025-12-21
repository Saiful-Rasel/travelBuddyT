import { Role } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../errors/appError";
import prisma from "../../shared/prisma";
import { paginationHelper } from "../../helpers/paginationHelper";

const updateUserRoleIntoDB = async (userId: number, role: string) => {
  if (!Object.values(Role).includes(role as any)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid role");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role as any,
    },
  });

  return updatedUser;
};

const blockTravelPlanByAdminIntoDB = async (planId: number) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: planId },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  if (travelPlan.isActive === false) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Travel plan already blocked by admin"
    );
  }

  const blockedPlan = await prisma.travelPlan.update({
    where: { id: planId },
    data: {
      isActive: false,
    },
  });

  return blockedPlan;
};
const unblockTravelPlanByAdminIntoDB = async (planId: number) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: planId },
  });

  if (!travelPlan) {
    throw new AppError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  // Already active check
  if (travelPlan.isActive === true) {
    throw new AppError(httpStatus.BAD_REQUEST, "Travel plan is already active");
  }

  const unblockedPlan = await prisma.travelPlan.update({
    where: { id: planId },
    data: {
      isActive: true,
    },
  });

  return unblockedPlan;
};

const getAllPayments = async () => {
  const payments = await prisma.payment.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!payments || payments.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No payments found");
  }

  return payments;
};

const verifyPaymentService = async (paymentId: number) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { user: true },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.status === "SUCCESS") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already verified");
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "SUCCESS" },
  });

  await prisma.user.update({
    where: { id: payment.userId },
    data: { premium: true },
  });

  return updatedPayment;
};

const getStatsService = async () => {
  const totalUsers = await prisma.user.count();
  const totalPremiumUsers = await prisma.user.count({
    where: { premium: true },
  });
  const totalPayments = await prisma.payment.count();
  const totalSuccessfulPayments = await prisma.payment.count({
    where: { status: "SUCCESS" },
  });
  const totalRevenueObj = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCESS" },
  });

  const totalRevenue = totalRevenueObj._sum.amount || 0;

  return {
    totalUsers,
    totalPremiumUsers,
    totalPayments,
    totalSuccessfulPayments,
    totalRevenue,
  };
};

const getAllUser = async (options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const total = await prisma.user.count({
    where: {
      role: {
        in: [Role.USER, Role.ADMIN],
      },
    },
  });

  const data = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.USER, Role.ADMIN],
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    omit: {
      password: true,
    },
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

const deleteUser = async (userId: number) => {
  return prisma.$transaction(async (tx) => {
    await tx.matchRequest.deleteMany({
      where: { senderId: userId },
    });

    await tx.matchRequest.deleteMany({
      where: { receiverId: userId },
    });

    await tx.review.deleteMany({
      where: { reviewerId: userId },
    });

    await tx.review.deleteMany({
      where: { reviewedId: userId },
    });

    await tx.matchRequest.deleteMany({
      where: {
        travelPlan: {
          userId: userId,
        },
      },
    });

    await tx.review.deleteMany({
      where: {
        travelPlan: {
          userId: userId,
        },
      },
    });

    await tx.travelPlan.deleteMany({
      where: { userId },
    });

    await tx.payment.deleteMany({
      where: { userId },
    });

    const deletedUser = await tx.user.delete({
      where: { id: userId },
    });

    return deletedUser;
  });
};

export const AdminService = {
  updateUserRoleIntoDB,
  blockTravelPlanByAdminIntoDB,
  unblockTravelPlanByAdminIntoDB,
  getAllPayments,
  verifyPaymentService,
  getStatsService,
  getAllUser,
  deleteUser,
};
