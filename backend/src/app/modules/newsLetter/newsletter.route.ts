import express from "express";

import { Role } from "@prisma/client";
import { newsletterController } from "./newsLetter.controller";
import { authRoutes } from "../auth/auth.route";
import auth from "../../middleware/authGuard";

const router = express.Router();


router.post("/subscribe", newsletterController.subscribeController);


router.get("/admin/list", auth(Role.ADMIN), newsletterController.listSubscribersController);
router.delete("/admin/:id", auth(Role.ADMIN), newsletterController.deleteSubscriberController);

export const newsletterRoutes = router;
