import { z } from "zod";

// User registration validation
export const registerUserSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.email("Invalid email").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().max(500).optional(),
  currentLocation: z.string().max(100).optional(),
  travelInterests: z.array(z.string()).optional().default([]),
  visitedCountries: z.array(z.string()).optional().default([]),
});

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .optional(),
  bio: z.string().max(500).optional(),
  currentLocation: z.string().max(100).optional(),
  travelInterests: z.array(z.string()).optional(),
  visitedCountries: z.array(z.string()).optional(),
});


export const parseToArray = (input?: string | string[]): string[] | undefined => {
  if (!input) return undefined;
  if (Array.isArray(input)) return input.map(c => c.trim()).filter(Boolean);
  return input.split(",").map(c => c.trim()).filter(Boolean);
};