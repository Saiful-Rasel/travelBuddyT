import MyTravelPlansClient from "@/components/modules/travel-plans/findMyTravelPlan";
import { TravelPlan } from "@/components/types/travelPlan";

import { getCookie } from "@/service/auth/tokenHandler";



export default async function MyTravelPlansPage() {
  const token = await getCookie("accessToken");

  let travelPlans: TravelPlan[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/my`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token }`
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
