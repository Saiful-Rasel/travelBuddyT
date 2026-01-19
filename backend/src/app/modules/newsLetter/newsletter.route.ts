import express from "express";


import { newsletterController } from "./newsLetter.controller";

import auth from "../../middleware/authGuard";
import { Role } from "@prisma/client";

const router = express.Router();


router.post("/subscribe", newsletterController.subscribeController);


router.get("/admin/list", auth(Role.ADMIN), newsletterController.listSubscribersController);
router.delete("/admin/:id", auth(Role.ADMIN), newsletterController.deleteSubscriberController);

export const newsletterRoutes = router;
