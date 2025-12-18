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
exports.travelPlanController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const travelPlan_service_1 = require("./travelPlan.service");
const fileUpload_1 = require("../../helpers/fileUpload");
const pick_1 = __importDefault(require("../../helpers/pick"));
const createTravelPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield travelPlan_service_1.travelPlanService.createTravelPlan(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Travel plan created successfully",
        data: result,
    });
}));
const getAllTravelPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield travelPlan_service_1.travelPlanService.getAllTravelPlans();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All travel plans retrieved successfully",
        data: result,
    });
}));
const getMyTravelPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield travelPlan_service_1.travelPlanService.getMyTravelPlans(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My travel plans retrieved successfully",
        data: result,
    });
}));
const getSingleTravelPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield travelPlan_service_1.travelPlanService.getSingleTravelPlan(Number(req.params.id));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Travel plan retrieved successfully",
        data: result,
    });
}));
const updateTravelPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const travelPlanId = Number(req.params.id);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (req.file) {
        const uploadResult = yield fileUpload_1.fileUploader.uploadToCloudinary(req.file);
        req.body.image = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const result = yield travelPlan_service_1.travelPlanService.updateTravelPlan({
        userId,
        planId: travelPlanId,
        payload: req.body
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Travel plan updated successfully",
        data: result,
    });
}));
const deleteTravelPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield travelPlan_service_1.travelPlanService.deleteTravelPlan(req.user, Number(req.params.id));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Travel plan deleted successfully",
        data: result,
    });
}));
const getFeedTravelPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const options = (0, pick_1.default)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = (0, pick_1.default)(req.query, [
        "destination",
        "startDate",
        "endDate",
        "minBudget",
        "maxBudget",
        "travelType",
        "isActive",
        "latitude",
        "longitude"
    ]);
    const plans = yield travelPlan_service_1.travelPlanService.getFeedTravelPlans((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, options, fillters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All active travel plans retrieved successfully",
        data: plans,
    });
}));
const getMatchedTravelPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const planId = Number(req.params.planId);
    const matched = yield travelPlan_service_1.travelPlanService.getMatchedTravelPlans(loggedInUserId, planId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Matched travel plans retrieved successfully",
        data: matched,
    });
}));
exports.travelPlanController = {
    createTravelPlan,
    getAllTravelPlans,
    getMyTravelPlans,
    getSingleTravelPlan,
    updateTravelPlan,
    deleteTravelPlan,
    getFeedTravelPlans,
    getMatchedTravelPlans
};
