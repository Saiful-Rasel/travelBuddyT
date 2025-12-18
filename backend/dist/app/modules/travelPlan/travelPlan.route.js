"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelPlanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authGuard_1 = __importDefault(require("../../middleware/authGuard"));
const travelPlan_controller_1 = require("./travelPlan.controller");
const fileUpload_1 = require("../../helpers/fileUpload");
const travelPlanSchema_1 = require("./travelPlanSchema");
const router = express_1.default.Router();
router.get("/feed", travelPlan_controller_1.travelPlanController.getFeedTravelPlans);
router.get("/:planId/matches", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), travelPlan_controller_1.travelPlanController.getMatchedTravelPlans);
router.post("/", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), fileUpload_1.fileUploader.upload.single("file"), (req, res, next) => {
    try {
        req.body = travelPlanSchema_1.travelPlanSchema.parse(JSON.parse(req.body.data));
        return travelPlan_controller_1.travelPlanController.createTravelPlan(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get("/", (0, authGuard_1.default)(client_1.Role.ADMIN), travelPlan_controller_1.travelPlanController.getAllTravelPlans);
router.get("/my", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), travelPlan_controller_1.travelPlanController.getMyTravelPlans);
router.get("/:id", travelPlan_controller_1.travelPlanController.getSingleTravelPlan);
router.patch("/:id", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), fileUpload_1.fileUploader.upload.single("file"), (req, res, next) => {
    try {
        const parsedData = req.body.data
            ? travelPlanSchema_1.travelPlanSchema.partial().parse(JSON.parse(req.body.data))
            : {};
        req.body = Object.assign({}, parsedData);
        return travelPlan_controller_1.travelPlanController.updateTravelPlan(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", (0, authGuard_1.default)(client_1.Role.USER, client_1.Role.ADMIN), travelPlan_controller_1.travelPlanController.deleteTravelPlan);
exports.travelPlanRoutes = router;
