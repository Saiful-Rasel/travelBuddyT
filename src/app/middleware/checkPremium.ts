
import { Request, Response, NextFunction } from "express";

export function checkPremium(req: Request & { user?: any} , res: Response, next: NextFunction) {

  if (!req?.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!req.user.premium) {
    return res.status(403).json({ success: false, message: "Only premium users can access this service" });
  }

  next();
}


