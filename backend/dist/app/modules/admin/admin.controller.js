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
exports.AdminController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const admin_service_1 = require("./admin.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../helpers/pick"));
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const { role } = req.body;
    const result = yield admin_service_1.AdminService.updateUserRoleIntoDB(userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User role updated successfully",
        data: result,
    });
}));
const blockTravelPlanByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planId = Number(req.params.id);
    const result = yield admin_service_1.AdminService.blockTravelPlanByAdminIntoDB(planId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Travel plan blocked by admin successfully",
        data: result,
    });
}));
const unBlockTravelPlanByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planId = Number(req.params.id);
    const result = yield admin_service_1.AdminService.unblockTravelPlanByAdminIntoDB(planId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Travel plan unBlocked by admin successfully",
        data: result,
    });
}));
const getPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield admin_service_1.AdminService.getAllPayments();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payments retrieved successfully",
        data: payments,
    });
}));
const verifyBadgeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const updatedUser = yield admin_service_1.AdminService.verifyPaymentService(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User badge verified successfully",
        data: updatedUser,
    });
}));
const getStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield admin_service_1.AdminService.getStatsService();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User stats get  successfully",
        data: stats,
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, [
        "page",
        "limit",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield admin_service_1.AdminService.getAllUser(options);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "user retrieve successfully!",
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const result = yield admin_service_1.AdminService.deleteUser(Number(userId));
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "user deleted successfully!",
        data: result,
    });
}));
exports.AdminController = {
    updateUserRole,
    blockTravelPlanByAdmin,
    unBlockTravelPlanByAdmin,
    getPayments,
    verifyBadgeController,
    getStats,
    getAllUser,
    deleteUser
};
