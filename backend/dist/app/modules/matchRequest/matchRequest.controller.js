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
exports.matchRequestController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const matchRequest_service_1 = require("./matchRequest.service");
const sendRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { travelPlanId, message } = req.body;
    const result = yield matchRequest_service_1.matchRequestService.sendRequest(req.user.id, travelPlanId, message);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Request sent successfully",
        data: result,
    });
}));
const listRequestsForPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { travelPlanId } = req.params;
    const result = yield matchRequest_service_1.matchRequestService.getRequestsForTravelPlan(Number(travelPlanId), req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Requests retrieved successfully",
        data: result,
    });
}));
const respondRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    const { action } = req.body;
    const result = yield matchRequest_service_1.matchRequestService.respondToMatchRequest(Number(requestId), req.user.id, action);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `Request ${action.toLowerCase()} successfully`,
        data: result,
    });
}));
const mySentRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchRequest_service_1.matchRequestService.getMySentRequests(req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My sent requests retrieved successfully",
        data: result,
    });
}));
exports.matchRequestController = {
    sendRequest,
    listRequestsForPlan,
    respondRequest,
    mySentRequests,
};
