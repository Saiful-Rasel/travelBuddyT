"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authGuard_1 = __importDefault(require("../../middleware/authGuard"));
const matchRequest_controller_1 = require("./matchRequest.controller");
const router = express_1.default.Router();
router.get("/plan/:travelPlanId", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), matchRequest_controller_1.matchRequestController.listRequestsForPlan);
router.post("/", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), matchRequest_controller_1.matchRequestController.sendRequest);
router.patch("/:requestId", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), matchRequest_controller_1.matchRequestController.respondRequest);
router.get("/my-sent", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), matchRequest_controller_1.matchRequestController.mySentRequests);
exports.matchRequestRoutes = router;
