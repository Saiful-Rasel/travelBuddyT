import { z } from "zod";


export const travelPlanSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  destination: z.string().min(2, "Destination is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid date",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date",
  }),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  travelType: z.enum(["SOLO", "FAMILY", "FRIENDS", "COUPLE"]), 
  description: z.string().optional(),
  itinerary: z.any().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});
