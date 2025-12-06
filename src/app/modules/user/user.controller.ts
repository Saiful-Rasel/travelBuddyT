import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  
  const role = (req.route.path === "/register-admin") ? "ADMIN" : "USER";
    const result = await UserService.createUser(req,role);


    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "user created successfully!",
        data: result
    })
})


export const userController = {
    createUser
}
