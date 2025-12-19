/* eslint-disable @typescript-eslint/no-explicit-any */

import MySentRequestsClient from "@/components/modules/my-request/mysentRequestClient";
import { getCookie } from "@/service/auth/tokenHandler";

export interface TravelPlan {
  id: number;
  userId: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  description?: string;
  image?: string | null;
  itinerary?: any[];
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Receiver {
  id: number;
  fullName: string;
}

export interface MatchRequest {
  id: number;
  senderId: number;
  receiverId: number;
  travelPlanId: number;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  travelPlan: TravelPlan;
  receiver: Receiver;
}

export default async function MySentRequestsPage() {
  const token = await getCookie("accessToken");

  let sentRequests: MatchRequest[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/match-requests/my-sent`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token }`, 
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      sentRequests = data.data || [];
    } else {
      const text = await res.text();
      console.error("Failed to fetch sent requests:", res.status, text);
    }
  } catch (err) {
    console.error("Failed to fetch sent requests:", err);
  }

  if (!sentRequests.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl text-muted-foreground">
          You have not sent any match requests yet.
        </p>
      </div>
    );
  }

  return <MySentRequestsClient requests={sentRequests} />;
}
