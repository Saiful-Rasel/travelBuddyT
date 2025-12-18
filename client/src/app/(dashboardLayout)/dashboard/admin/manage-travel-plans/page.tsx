
import TravelPlansTable from "@/components/modules/admin/travelPlansTable";
import { getCookie } from "@/service/auth/tokenHandler";

async function getTravelPlans() {
  const token = await getCookie("accessToken");

  const res = await fetch("http://localhost:8000/api/travel-plans", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch travel plans");
  }

  const json = await res.json();
  return json.data;
}

export default async function AdminTravelPlansPage() {
  const travelPlans = await getTravelPlans();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold"> Travel Plans (Admin)</h1>
      <TravelPlansTable travelPlans={travelPlans} />
    </div>
  );
}
