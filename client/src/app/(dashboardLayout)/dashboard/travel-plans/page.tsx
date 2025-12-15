import MyTravelPlansClient from "@/components/modules/travel-plans/findMyTravelPlan";

import { getCookie } from "@/service/auth/tokenHandler";
export interface MatchRequest {
  id: number;
  senderId: number;
  receiverId: number;
  travelPlanId: number;
  message?: string;
  status: string;
  sender: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
  receiver: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}
interface TravelPlan {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  description?: string;
  image?: string | null;
  matchRequests: MatchRequest[];
}

export default async function MyTravelPlansPage() {
  const token = await getCookie("accessToken");

  let travelPlans: TravelPlan[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/travel-plans/my`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${token}`,
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      travelPlans = data.data || [];
    } else {
      const text = await res.text();
      console.error("Failed to fetch travel plans:", res.status, text);
    }
  } catch (err) {
    console.error("Failed to fetch travel plans:", err);
  }

  return <MyTravelPlansClient plans={travelPlans.length ? travelPlans : []} />;
}
