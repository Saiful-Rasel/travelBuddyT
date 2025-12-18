"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToArray = exports.updateUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
// User registration validation
exports.registerUserSchema = zod_1.z.object({
    fullName: zod_1.z.string().nonempty("Full name is required"),
    email: zod_1.z.email("Invalid email").nonempty("Email is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    bio: zod_1.z.string().max(500).optional(),
    currentLocation: zod_1.z.string().max(100).optional(),
    travelInterests: zod_1.z.array(zod_1.z.string()).optional().default([]),
    visitedCountries: zod_1.z.array(zod_1.z.string()).optional().default([]),
});
exports.updateUserSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .optional(),
    bio: zod_1.z.string().max(500).optional(),
    currentLocation: zod_1.z.string().max(100).optional(),
    travelInterests: zod_1.z.array(zod_1.z.string()).optional(),
    visitedCountries: zod_1.z.array(zod_1.z.string()).optional(),
});
const parseToArray = (input) => {
    if (!input)
        return undefined;
    if (Array.isArray(input))
        return input.map(c => c.trim()).filter(Boolean);
    return input.split(",").map(c => c.trim()).filter(Boolean);
};
exports.parseToArray = parseToArray;
