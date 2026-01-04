// src/app/(commonLayout)/travel-plans/[id]/page.tsx

import TravelPlanDetailsClient from "@/components/modules/travel-plans/travelPlanDetailsClient";
import { getUserInfo } from "@/service/auth/getUserInfo";


interface PageProps {
  params: {
    id: string;
  };
}

interface TravelPlan {
  id: number;
  userId: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget: number;
  maxBudget: number;
  travelType: string;
  description: string;
  isActive:boolean;
  itinerary: { day: number; activity: string }[];
  image?: string | null;
  user: {
    id: number;
    fullName: string;
    profileImage?: string | null;
  };
  reviews?: {
    id: number;
    reviewerId: number;
    travelPlanId: number;
    rating: number;
    comment: string;
    reviewer: {
      id: number;
      fullName: string;
    };
  }[];
}

export default async function TravelPlanDetailsPage({ params }: PageProps) {
  const unwrappedParams = await params;
  const planId = unwrappedParams.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/${planId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <p>Failed to fetch travel plan details.</p>;
  }

  const result = await res.json();
  const plan: TravelPlan = result.data;

  const userData = await getUserInfo();
  console.log(userData)

  return <TravelPlanDetailsClient plan={plan} currentUser={userData} />;
}
