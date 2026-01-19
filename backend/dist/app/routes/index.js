"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const travelPlan_route_1 = require("../modules/travelPlan/travelPlan.route");
const matchRequest_route_1 = require("../modules/matchRequest/matchRequest.route");
const reviews_route_1 = require("../modules/reviews/reviews.route");
const ai_route_1 = require("../modules/LocalAi/ai.route");
const payment_route_1 = require("../modules/payment/payment.route");
const admin_route_1 = require("../modules/admin/admin.route");
const newsletter_route_1 = require("../modules/newsLetter/newsletter.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.userRoutes
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes
    },
    {
        path: '/travel-plans',
        route: travelPlan_route_1.travelPlanRoutes
    },
    {
        path: '/match-requests',
        route: matchRequest_route_1.matchRequestRoutes
    },
    {
        path: '/reviews',
        route: reviews_route_1.reviewRoutes
    },
    {
        path: '/ai',
        route: ai_route_1.aiRoutes
    },
    {
        path: '/payment',
        route: payment_route_1.paymentRoutes
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes
    },
    {
        path: '/newsletter',
        route: newsletter_route_1.newsletterRoutes
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
