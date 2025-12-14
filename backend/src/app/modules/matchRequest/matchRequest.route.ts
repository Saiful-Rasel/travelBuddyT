import express from "express";
import { Role } from "@prisma/client";
import auth from "../../middleware/authGuard";
import { matchRequestController } from "./matchRequest.controller";


const router = express.Router();


router.get("/plan/:travelPlanId", auth(Role.USER, Role.ADMIN), matchRequestController.listRequestsForPlan);
router.post("/", auth(Role.USER, Role.ADMIN), matchRequestController.sendRequest);



router.patch("/:requestId", auth(Role.USER, Role.ADMIN), matchRequestController.respondRequest);


router.get("/my-sent", auth(Role.USER, Role.ADMIN), matchRequestController.mySentRequests);

export const matchRequestRoutes = router;
