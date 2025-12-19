import MyTravelPlansClient from "@/components/modules/travel-plans/findMyTravelPlan";

import { getCookie } from "@/service/auth/tokenHandler";
import { TravelPlan } from "../my-request/page";


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
