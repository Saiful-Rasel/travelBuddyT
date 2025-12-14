import express from "express";
import { generateItinerary } from "./ai.service";
import { checkPremium } from "../../middleware/checkPremium";
import auth from "../../middleware/authGuard";
import { Role } from "@prisma/client";
import sendResponse from "../../shared/sendResponse";

const router = express.Router();

router.post(
  "/itinerary",
  auth(Role.ADMIN, Role.USER),
  checkPremium,
  async (req, res) => {
    try {
      const payload = req.body || {};
      if (!payload.days) payload.days = 5;
      const plan = await generateItinerary(payload);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Itinerary generated successfully",
        data: plan,
      });
    } catch (err: any) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: err.message || "Server error" });
    }
  }
);

export const aiRoutes = router;
