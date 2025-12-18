"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const reviews_service_1 = require("./reviews.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
// Create review
const createReviewController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewedId, travelPlanId, rating, comment } = req.body;
    const review = yield reviews_service_1.reviewService.createReview(req.user.id, reviewedId, travelPlanId, rating, comment);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Review created successfully",
        data: review,
    });
}));
// Get all reviews for a travel plan
const getReviewsByTravelPlanController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { travelPlanId } = req.params;
    const reviews = yield reviews_service_1.reviewService.getReviewsByTravelPlan(Number(travelPlanId));
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reviews retrieved successfully",
        data: reviews,
    });
}));
const getReviewsForUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log("Requested userId:", userId);
    const reviews = yield reviews_service_1.reviewService.getReviewsForUser(Number(userId));
    console.log("Reviews found:", reviews);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User reviews retrieved successfully",
        data: reviews,
    });
}));
const updateReviewController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const data = req.body;
    const review = yield reviews_service_1.reviewService.updateReview(Number(reviewId), req.user.id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review updated successfully",
        data: review,
    });
}));
const deleteReviewController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const review = yield reviews_service_1.reviewService.deleteReview(Number(reviewId), req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review deleted successfully",
        data: review,
    });
}));
exports.reviewController = {
    createReviewController,
    getReviewsByTravelPlanController,
    getReviewsForUserController,
    updateReviewController,
    deleteReviewController,
};
