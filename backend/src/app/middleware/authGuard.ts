import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import { jwtHelper } from "../helpers/jwtHelper";
import AppError from "../errors/appError";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      } else if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized! Token missing.");
      }

      let verifyUser;
      try {
        verifyUser = jwtHelper.verifyToken(token, config.jwt.jwt_secret as Secret);
      } catch (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or malformed token");
      }

      req.user = verifyUser;

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized for this role!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
