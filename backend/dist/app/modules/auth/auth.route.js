"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const authGuard_1 = __importDefault(require("../../middleware/authGuard"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/me", auth_controller_1.AuthController.getMe);
router.post("/login", auth_controller_1.AuthController.login);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.post('/change-password', (0, authGuard_1.default)(client_1.Role.ADMIN, client_1.Role.USER), auth_controller_1.AuthController.changePassword);
// router.post(
//     '/forgot-password',
//     AuthController.forgotPassword
// );
// router.post(
//     '/reset-password',
//     AuthController.resetPassword
// )
exports.authRoutes = router;
