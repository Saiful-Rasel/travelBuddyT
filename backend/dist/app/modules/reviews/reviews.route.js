"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authGuard_1 = __importDefault(require("../../middleware/authGuard"));
const reviews_controller_1 = require("./reviews.controller");
const router = express_1.default.Router();
router.post("/", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), reviews_controller_1.reviewController.createReviewController);
router.get("/:travelPlanId", reviews_controller_1.reviewController.getReviewsByTravelPlanController);
router.get("/user/:userId", reviews_controller_1.reviewController.getReviewsForUserController);
router.patch("/:reviewId", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), reviews_controller_1.reviewController.updateReviewController);
router.delete("/:reviewId", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), reviews_controller_1.reviewController.deleteReviewController);
exports.reviewRoutes = router;
