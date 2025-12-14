// src/app/travel-plans/page.tsx

import TravelPlansClient from "@/components/modules/travel-plans/travelPlanClient";
import { TravelPlan } from "@/components/types/travelPlan";

interface TravelPlansApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: TravelPlan[];
  };
}

interface PageProps {
  searchParams?: {
    page?: string; 
  };
}

export default async function TravelPlansPage({ searchParams }: PageProps) {
 const params = await searchParams;
  const page = Number(params?.page || 1);
  const limit = 8

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/travel-plans/feed?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch travel plans");
  }

  const result: TravelPlansApiResponse = await res.json();


  return (
    <TravelPlansClient
      travelPlans={result.data.data}
      meta={result.data.meta}
    />
  );
}
