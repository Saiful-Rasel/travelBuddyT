import { Router } from "express";
import auth from "../../middleware/authGuard";
import { Role } from "@prisma/client";
import { AdminController } from "./admin.controller";




const router = Router()
router.get("/users",auth(Role.ADMIN), AdminController.getAllUser);
router.patch(
  "/users/:id/role",
  auth(Role.ADMIN),
  AdminController.updateUserRole
);
router.patch(
  "/travel-plans/:id/block",
  auth(Role.ADMIN),
  AdminController.blockTravelPlanByAdmin
);
router.patch(
  "/travel-plans/:id/unblock",
  auth(Role.ADMIN),
  AdminController.unBlockTravelPlanByAdmin
);

router.get(
  "/payments",
  auth(Role.ADMIN),
  AdminController.getPayments
);

router.get("/stats", auth(Role.ADMIN),AdminController.getStats);

router.delete("/user/:id",auth(Role.ADMIN),AdminController.deleteUser)

router.patch("/users/:id/updatePayment",auth(Role.ADMIN), AdminController.verifyBadgeController);
export const AdminRoutes = router;