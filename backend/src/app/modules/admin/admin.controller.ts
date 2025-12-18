import { Request, Response } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helpers/pick";




const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const { role } = req.body;

    const result =
      await AdminService.updateUserRoleIntoDB(userId, role);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User role updated successfully",
      data: result,
    });
  }
);



const blockTravelPlanByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const planId = Number(req.params.id);

    const result =
      await AdminService.blockTravelPlanByAdminIntoDB(planId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Travel plan blocked by admin successfully",
      data: result,
    });
  }
);
const unBlockTravelPlanByAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const planId = Number(req.params.id);

    const result =
      await AdminService.unblockTravelPlanByAdminIntoDB(planId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Travel plan unBlocked by admin successfully",
      data: result,
    });
  }
);


  
const getPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await AdminService.getAllPayments();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: payments,
  });
});

const verifyBadgeController = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const updatedUser = await AdminService.verifyPaymentService(userId);


    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User badge verified successfully",
    data: updatedUser,
  });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await AdminService.getStatsService();
    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User stats get  successfully",
    data: stats,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const options: any = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await AdminService.getAllUser(options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "user retrieve successfully!",
    data: result,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id)
  const result = await AdminService.deleteUser(Number(userId));

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "user deleted successfully!",
    data: result,
  });
});

export const AdminController = {
  updateUserRole,
  blockTravelPlanByAdmin,
  unBlockTravelPlanByAdmin,
  getPayments,
  verifyBadgeController,
  getStats,
  getAllUser,
  deleteUser
};
