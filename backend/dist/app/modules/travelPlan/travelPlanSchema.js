"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelPlanSchema = void 0;
const zod_1 = require("zod");
exports.travelPlanSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    destination: zod_1.z.string().min(2, "Destination is required"),
    startDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Start date must be a valid date",
    }),
    endDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "End date must be a valid date",
    }),
    minBudget: zod_1.z.number().optional(),
    maxBudget: zod_1.z.number().optional(),
    travelType: zod_1.z.enum(["SOLO", "FAMILY", "FRIENDS", "COUPLE"]),
    description: zod_1.z.string().optional(),
    itinerary: zod_1.z.any().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
});
