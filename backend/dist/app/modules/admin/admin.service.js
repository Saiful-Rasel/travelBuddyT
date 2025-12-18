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
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const updateUserRoleIntoDB = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.values(client_1.Role).includes(role)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid role");
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            role: role,
        },
    });
    return updatedUser;
});
const blockTravelPlanByAdminIntoDB = (planId) => __awaiter(void 0, void 0, void 0, function* () {
    const travelPlan = yield prisma_1.default.travelPlan.findUnique({
        where: { id: planId },
    });
    if (!travelPlan) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Travel plan not found");
    }
    if (travelPlan.isActive === false) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Travel plan already blocked by admin");
    }
    const blockedPlan = yield prisma_1.default.travelPlan.update({
        where: { id: planId },
        data: {
            isActive: false,
        },
    });
    return blockedPlan;
});
const unblockTravelPlanByAdminIntoDB = (planId) => __awaiter(void 0, void 0, void 0, function* () {
    const travelPlan = yield prisma_1.default.travelPlan.findUnique({
        where: { id: planId },
    });
    if (!travelPlan) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Travel plan not found");
    }
    // Already active check
    if (travelPlan.isActive === true) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Travel plan is already active");
    }
    const unblockedPlan = yield prisma_1.default.travelPlan.update({
        where: { id: planId },
        data: {
            isActive: true,
        },
    });
    return unblockedPlan;
});
const getAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield prisma_1.default.payment.findMany({
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!payments || payments.length === 0) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "No payments found");
    }
    return payments;
});
const verifyPaymentService = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield prisma_1.default.payment.findUnique({
        where: { id: paymentId },
        include: { user: true },
    });
    if (!payment) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Payment not found");
    }
    if (payment.status === "SUCCESS") {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Payment already verified");
    }
    const updatedPayment = yield prisma_1.default.payment.update({
        where: { id: paymentId },
        data: { status: "SUCCESS" },
    });
    yield prisma_1.default.user.update({
        where: { id: payment.userId },
        data: { premium: true },
    });
    return updatedPayment;
});
const getStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield prisma_1.default.user.count();
    const totalPremiumUsers = yield prisma_1.default.user.count({ where: { premium: true } });
    const totalPayments = yield prisma_1.default.payment.count();
    const totalSuccessfulPayments = yield prisma_1.default.payment.count({ where: { status: "SUCCESS" } });
    const totalRevenueObj = yield prisma_1.default.payment.aggregate({
        _sum: { amount: true },
        where: { status: "SUCCESS" },
    });
    const totalRevenue = totalRevenueObj._sum.amount || 0;
    return {
        totalUsers,
        totalPremiumUsers,
        totalPayments,
        totalSuccessfulPayments,
        totalRevenue,
    };
});
const getAllUser = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const total = yield prisma_1.default.user.count({
        where: { role: {
                in: [client_1.Role.USER, client_1.Role.ADMIN],
            }
        }
    });
    const data = yield prisma_1.default.user.findMany({
        where: { role: {
                in: [client_1.Role.USER, client_1.Role.ADMIN],
            } },
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        omit: {
            password: true,
        },
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
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.delete({
        where: { id: userId }
    });
    return user;
});
exports.AdminService = {
    updateUserRoleIntoDB,
    blockTravelPlanByAdminIntoDB,
    unblockTravelPlanByAdminIntoDB,
    getAllPayments,
    verifyPaymentService,
    getStatsService,
    getAllUser,
    deleteUser
};
