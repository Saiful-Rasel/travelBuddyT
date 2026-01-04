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
exports.travelPlanService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const appError_1 = __importDefault(require("../../errors/appError"));
const fileUpload_1 = require("../../helpers/fileUpload");
const paginationHelper_1 = require("../../helpers/paginationHelper");
const client_1 = require("@prisma/client");
const createTravelPlan = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(req === null || req === void 0 ? void 0 : req.user))
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    if (req.file) {
        const uploadResult = yield fileUpload_1.fileUploader.uploadToCloudinary(req.file);
        req.body.image = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const today = new Date();
    const startDate = new Date(req.body.startDate);
    if (startDate < today) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Start date cannot be in the past");
    }
    const endDate = new Date(req.body.endDate);
    if (endDate < startDate) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "End date cannot be before start date");
    }
    return yield prisma_1.default.travelPlan.create({
        data: Object.assign(Object.assign({}, req.body), { startDate,
            endDate, userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id }),
    });
});
const getAllTravelPlans = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.travelPlan.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
});
const getMyTravelPlans = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.travelPlan.findMany({
        where: {
            userId: user.id, // আমার travel plan
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                },
            },
            matchRequests: {
                include: {
                    sender: {
                        select: {
                            id: true,
                            fullName: true,
                            profileImage: true,
                        },
                    },
                    receiver: {
                        select: {
                            id: true,
                            fullName: true,
                            profileImage: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            reviews: {
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            fullName: true,
                            profileImage: true,
                        },
                    },
                },
            },
        },
    });
});
const getSingleTravelPlan = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.travelPlan.findUniqueOrThrow({
        where: { id: id },
        include: {
            user: {
                select: { id: true, fullName: true, profileImage: true },
            },
        },
    });
});
const updateTravelPlan = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, planId, payload, }) {
    const plan = yield prisma_1.default.travelPlan.findUnique({
        where: { id: planId },
    });
    if (!plan) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Travel plan not found");
    }
    if (plan.userId !== userId && client_1.Role.ADMIN !== "ADMIN") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You cannot edit this plan");
    }
    if (payload.startDate)
        payload.startDate = new Date(payload.startDate);
    if (payload.endDate)
        payload.endDate = new Date(payload.endDate);
    const updatedPlan = yield prisma_1.default.travelPlan.update({
        where: { id: planId },
        data: payload,
    });
    return updatedPlan;
});
const deleteTravelPlan = (user, planId) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield prisma_1.default.travelPlan.findUniqueOrThrow({
        where: { id: planId },
    });
    if (plan.userId !== user.id && user.role !== "ADMIN") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You cannot delete this plan");
    }
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.review.deleteMany({
            where: { travelPlanId: planId }
        });
        yield tx.matchRequest.deleteMany({
            where: { travelPlanId: planId }
        });
        return yield tx.travelPlan.delete({
            where: { id: planId },
        });
    }));
});
const getFeedTravelPlans = (userId, options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { destination, travelType, minBudget, maxBudget, isActive, latitude, longitude, startDate, endDate, } = filters;
    const whereConditions = {
        NOT: {
            userId: userId,
        },
    };
    if (isActive !== undefined) {
        whereConditions.isActive = isActive === "true";
    }
    if (destination) {
        whereConditions.destination = {
            contains: destination,
            mode: "insensitive",
        };
    }
    if (startDate || endDate) {
        whereConditions.AND = [
            {
                startDate: {
                    lte: endDate ? new Date(endDate) : new Date("9999-12-31"),
                },
            },
            {
                endDate: {
                    gte: startDate ? new Date(startDate) : new Date("0001-01-01"),
                },
            },
        ];
    }
    if (minBudget) {
        whereConditions.minBudget = {
            gte: Number(minBudget),
        };
    }
    if (maxBudget) {
        whereConditions.maxBudget = {
            lte: Number(maxBudget),
        };
    }
    if (travelType) {
        whereConditions.travelType = travelType;
    }
    if (latitude) {
        whereConditions.latitude = Number(latitude);
    }
    if (longitude) {
        whereConditions.longitude = Number(longitude);
    }
    const data = yield prisma_1.default.travelPlan.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            user: {
                select: { id: true, fullName: true, profileImage: true },
            },
            reviews: {
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            fullName: true,
                            profileImage: true,
                        },
                    },
                },
            },
        },
    });
    const total = yield prisma_1.default.travelPlan.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data,
    };
});
const getMatchedTravelPlans = (userId, planId) => __awaiter(void 0, void 0, void 0, function* () {
    const myPlan = yield prisma_1.default.travelPlan.findFirst({
        where: { id: planId, userId },
    });
    if (!myPlan) {
        throw new Error("Travel plan not found");
    }
    if (myPlan.startDate > myPlan.endDate) {
        throw new Error("Invalid travel plan dates: startDate is after endDate");
    }
    const baseConditions = {
        userId: { not: userId },
        isActive: true,
        destination: { contains: myPlan.destination, mode: "insensitive" },
        travelType: myPlan.travelType,
        AND: [
            { startDate: { lte: myPlan.endDate } },
            { endDate: { gte: myPlan.startDate } },
        ],
        minBudget: { lte: myPlan.maxBudget },
        maxBudget: { gte: myPlan.minBudget },
    };
    const excludedRequests = yield prisma_1.default.matchRequest.findMany({
        where: { senderId: userId },
        select: { travelPlanId: true },
    });
    const excludeIds = excludedRequests.map((r) => r.travelPlanId);
    if (excludeIds.length > 0) {
        baseConditions.id = { notIn: excludeIds };
    }
    const matchedPlans = yield prisma_1.default.travelPlan.findMany({
        where: baseConditions,
        include: {
            user: { select: { id: true, fullName: true, profileImage: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return matchedPlans;
});
exports.travelPlanService = {
    createTravelPlan,
    getAllTravelPlans,
    getMyTravelPlans,
    getSingleTravelPlan,
    updateTravelPlan,
    deleteTravelPlan,
    getMatchedTravelPlans,
    getFeedTravelPlans,
};
