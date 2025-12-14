import express, { NextFunction, Request, Response } from "express";

import { Role } from "@prisma/client";
import auth from "../../middleware/authGuard";
import { travelPlanController } from "./travelPlan.controller";
import { fileUploader } from "../../helpers/fileUpload";
import { travelPlanSchema } from "./travelPlanSchema";

const router = express.Router();

router.get(
  "/feed",

  travelPlanController.getFeedTravelPlans
);

router.get(
  "/:planId/matches",
  auth(Role.USER, Role.ADMIN),
  travelPlanController.getMatchedTravelPlans
);

router.post(
  "/",
  auth(Role.USER, Role.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = travelPlanSchema.parse(JSON.parse(req.body.data));
      return travelPlanController.createTravelPlan(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", travelPlanController.getAllTravelPlans);

router.get(
  "/my",
  auth(Role.USER, Role.ADMIN),
  travelPlanController.getMyTravelPlans
);

router.get("/:id", travelPlanController.getSingleTravelPlan);

router.patch(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = req.body.data
        ? travelPlanSchema.partial().parse(JSON.parse(req.body.data))
        : {};
      req.body = { ...parsedData };
      return travelPlanController.updateTravelPlan(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  travelPlanController.deleteTravelPlan
);

export const travelPlanRoutes = router;
