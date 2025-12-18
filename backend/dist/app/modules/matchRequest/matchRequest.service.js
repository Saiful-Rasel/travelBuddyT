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
exports.matchRequestService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const sendRequest = (senderId, travelPlanId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const travelPlan = yield prisma_1.default.travelPlan.findUnique({
        where: { id: travelPlanId },
        select: { userId: true },
    });
    if (!travelPlan) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Travel plan not found");
    }
    if (travelPlan.userId === senderId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You cannot send a request to your own travel plan");
    }
    const existing = yield prisma_1.default.matchRequest.findUnique({
        where: { senderId_travelPlanId: { senderId, travelPlanId } },
    });
    if (existing) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Request already sent");
    }
    return yield prisma_1.default.matchRequest.create({
        data: {
            senderId,
            receiverId: travelPlan.userId,
            travelPlanId,
            message,
        },
    });
});
const getRequestsForTravelPlan = (travelPlanId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield prisma_1.default.travelPlan.findUnique({
        where: { id: travelPlanId },
    });
    if (!plan) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Travel plan not found");
    }
    if (plan.userId !== userId) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Not authorized to view requests");
    }
    return yield prisma_1.default.matchRequest.findMany({
        where: { travelPlanId },
        include: {
            sender: { select: { id: true, fullName: true, profileImage: true } },
        },
        orderBy: { createdAt: "desc" },
    });
});
const respondToMatchRequest = (requestId, userId, action) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield prisma_1.default.matchRequest.findUnique({
        where: { id: requestId },
        include: { travelPlan: true },
    });
    if (!request)
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Request not found");
    if (request.travelPlan.userId !== userId) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Not authorized to respond");
    }
    return yield prisma_1.default.matchRequest.update({
        where: { id: requestId },
        data: { status: action },
    });
});
const getMySentRequests = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.matchRequest.findMany({
        where: { senderId: userId },
        include: {
            travelPlan: true,
            receiver: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: "desc" },
    });
});
exports.matchRequestService = {
    sendRequest,
    getRequestsForTravelPlan,
    respondToMatchRequest,
    getMySentRequests,
};
