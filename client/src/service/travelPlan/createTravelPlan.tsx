/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { getCookie } from "../auth/tokenHandler";

// Schema including itinerary
const itineraryItemSchema = z.object({
  day: z.number().min(1),
  activity: z.string().min(1, "Activity is required"),
});

const travelPlanSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  minBudget: z.number().optional(),
  maxBudget: z.number().optional(),
  travelType: z.enum(["SOLO", "FAMILY", "FRIENDS", "COUPLE"]),
  description: z.string().optional(),
  itinerary: z
    .array(itineraryItemSchema)
    .min(1, "At least one itinerary item is required"),
});

export const createTravelPlan = async (currentState: any, formData: FormData) => {
  try {
    const token = await getCookie("accessToken");

    // Parse itinerary if present
    const itineraryRaw = formData.get("itinerary");
    const itinerary = itineraryRaw ? JSON.parse(itineraryRaw as string) : [];

    // Build data object
    const data = {
      title: formData.get("title") as string,
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      minBudget: formData.get("minBudget") ? Number(formData.get("minBudget")) : undefined,
      maxBudget: formData.get("maxBudget") ? Number(formData.get("maxBudget")) : undefined,
      travelType: formData.get("travelType") as string,
      description: formData.get("description") as string,
      itinerary,
    };

    // Validate
    const validated = travelPlanSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.issues.map((issue) => ({
          field: String(issue.path[0]),
          message: issue.message,
        })),
      };
    }

    // Prepare FormData with a single `data` field
    const apiFormData = new FormData();
    apiFormData.append("data", JSON.stringify(validated.data));

    // Append file if present
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      apiFormData.append("file", file);
    }

    // Send request
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/travel-plans`, {
      method: "POST",
      headers: {
        Cookie: `accessToken=${token}`,
      },
      credentials: "include",
      body: apiFormData,
    });

    // Safely parse JSON response
    let result: any = {};
    try {
      result = await res.json();
    } catch {
      result = {};
    }
    console.log(result, "result");

    if (!res.ok) {
      throw new Error(result.message || "Create failed");
    }

    return { success: true };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error?.message || "Failed to create travel plan",
    };
  }
};
