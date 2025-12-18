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
exports.reviewService = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createReview = (reviewerId, reviewedId, travelPlanId, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
    if (reviewerId === reviewedId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You cannot review yourself");
    }
    const match = yield prisma_1.default.matchRequest.findFirst({
        where: {
            travelPlanId,
            senderId: reviewerId,
            status: "ACCEPTED",
        },
    });
    if (!match) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You are not allowed to review this travel plan");
    }
    const existing = yield prisma_1.default.review.findFirst({
        where: { reviewerId, travelPlanId },
    });
    if (existing) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Review already exists");
    }
    const plan = yield prisma_1.default.travelPlan.findUnique({ where: { id: travelPlanId } });
    if (!plan) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Travel plan not found");
    }
    if (plan.isActive) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You can review only after the plan ends");
    }
    return yield prisma_1.default.review.create({
        data: {
            reviewerId,
            reviewedId,
            travelPlanId,
            rating,
            comment,
        },
    });
});
const getReviewsByTravelPlan = (travelPlanId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.review.findMany({
        where: { travelPlanId },
        include: {
            reviewer: { select: { id: true, fullName: true, profileImage: true } },
            reviewed: { select: { id: true, fullName: true, profileImage: true } },
        },
        orderBy: { createdAt: "desc" },
    });
});
const getReviewsForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.review.findMany({
        where: { reviewedId: userId },
        include: {
            reviewer: { select: { id: true, fullName: true, profileImage: true } },
            travelPlan: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
    });
});
const updateReview = (reviewId, reviewerId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({ where: { id: reviewId } });
    if (!review || review.reviewerId !== reviewerId) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Not allowed to update this review");
    }
    return yield prisma_1.default.review.update({
        where: { id: reviewId },
        data,
    });
});
const deleteReview = (reviewId, reviewerId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({ where: { id: reviewId } });
    if (!review || review.reviewerId !== reviewerId) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Not allowed to delete this review");
    }
    return yield prisma_1.default.review.delete({ where: { id: reviewId } });
});
exports.reviewService = {
    createReview,
    getReviewsByTravelPlan,
    getReviewsForUser,
    updateReview,
    deleteReview,
};
