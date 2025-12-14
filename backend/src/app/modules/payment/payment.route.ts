import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middleware/authGuard";
import { Role } from "@prisma/client";

const router = Router()

router.post('/create',auth(Role.USER,Role.ADMIN), paymentController.createPayment);

export const paymentRoutes = router;