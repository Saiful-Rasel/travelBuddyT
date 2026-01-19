"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const newsLetter_controller_1 = require("./newsLetter.controller");
const authGuard_1 = __importDefault(require("../../middleware/authGuard"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/subscribe", newsLetter_controller_1.newsletterController.subscribeController);
router.get("/admin/list", (0, authGuard_1.default)(client_1.Role.ADMIN), newsLetter_controller_1.newsletterController.listSubscribersController);
router.delete("/admin/:id", (0, authGuard_1.default)(client_1.Role.ADMIN), newsLetter_controller_1.newsletterController.deleteSubscriberController);
exports.newsletterRoutes = router;
