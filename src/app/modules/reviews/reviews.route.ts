import express from "express";
import { Role } from "@prisma/client";
import auth from "../../middleware/authGuard";
import { reviewController } from "./reviews.controller";


const router = express.Router();


router.post("/", auth(Role.USER, Role.ADMIN), reviewController.createReviewController);


router.get("/:travelPlanId", reviewController.getReviewsByTravelPlanController);


router.get("/user/:userId", reviewController.getReviewsForUserController);


router.patch("/:reviewId", auth(Role.USER, Role.ADMIN), reviewController.updateReviewController);


router.delete("/:reviewId", auth(Role.USER, Role.ADMIN), reviewController.deleteReviewController);

export const reviewRoutes = router;
