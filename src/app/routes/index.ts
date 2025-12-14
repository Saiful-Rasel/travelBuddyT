import express from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { travelPlanRoutes } from '../modules/travelPlan/travelPlan.route';
import { matchRequestRoutes } from '../modules/matchRequest/matchRequest.route';
import { reviewRoutes } from '../modules/reviews/reviews.route';
import { aiRoutes } from '../modules/LocalAi/ai.route';
import { paymentRoutes } from '../modules/payment/payment.route';



const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/travel-plans',
        route: travelPlanRoutes
    },
    {
        path: '/match-requests',
        route: matchRequestRoutes
    },
    {
        path: '/reviews',
        route: reviewRoutes
    },
    {
        path: '/ai',
        route:aiRoutes
    },
    {
        path: '/payment',
        route: paymentRoutes
    },
   
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;