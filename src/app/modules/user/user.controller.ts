import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../helpers/pick";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "user created successfully!",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const options: any = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await UserService.getAllUser(options);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "user retrieve successfully!",
    data: result,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const result = await UserService.getSingleUser(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "single user retrieve successfully!",
    data: result,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const updatedUser = await UserService.updateUser(id, req.body, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully!",
    data: updatedUser,
  });
});

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
};
