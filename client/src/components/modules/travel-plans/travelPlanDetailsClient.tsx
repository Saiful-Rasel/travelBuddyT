"use client";

import Image from "next/image";

interface TravelPlanDetailsClientProps {
  plan: {
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
  };
}

export default function TravelPlanDetailsClient({ plan }: TravelPlanDetailsClientProps) {
  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{plan.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{plan.description}</p>

        <p><strong>Destination:</strong> {plan.destination}</p>
        <p><strong>Travel Dates:</strong> {plan.startDate} - {plan.endDate}</p>
        <p><strong>Budget:</strong> {plan.minBudget} - {plan.maxBudget}</p>
        <p><strong>Travel Type:</strong> {plan.travelType}</p>

        {plan.image && (
          <Image
            src={plan.image}
            alt={plan.title}
            width={800}
            height={400}
            className="mt-4 w-full rounded-lg object-cover"
          />
        )}

        {plan.itinerary?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Itinerary</h2>
            <ul className="list-disc pl-5">
              {plan.itinerary.map((item) => (
                <li key={item.day}>
                  <strong>Day {item.day}:</strong> {item.activity}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Created By</h2>
          <p>{plan.user.fullName}</p>
        </div>

        {plan.reviews && plan.reviews.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
            <ul className="space-y-2">
              {plan.reviews.map((review) => (
                <li key={review.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <strong>{review.reviewer.fullName}</strong>: {review.comment} (⭐ {review.rating})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
