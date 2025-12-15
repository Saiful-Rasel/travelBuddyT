/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/components/types/user";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

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
  currentUser: User | null;
}

export default function TravelPlanDetailsClient({
  plan,
  currentUser,
}: TravelPlanDetailsClientProps) {
  const [message, setMessage] = useState("I want to join your trip");
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!currentUser)
      return toast.error("You must be logged in to send a request");

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/match-requests`,
        {
          method: "POST",
          credentials: "include", // include cookies if auth depends on them
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
            travelPlanId: plan.id,
            message,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send request");
      }

      toast.success("Request sent successfully!");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      {/* Toaster placement */}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{plan.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {plan.description}
        </p>

        <p>
          <strong>Destination:</strong> {plan.destination}
        </p>
        <p>
          <strong>Travel Dates:</strong> {plan.startDate} - {plan.endDate}
        </p>
        <p>
          <strong>Budget:</strong> {plan.minBudget} - {plan.maxBudget}
        </p>
        <p>
          <strong>Travel Type:</strong> {plan.travelType}
        </p>

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
                <li
                  key={review.id}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded"
                >
                  <strong>{review.reviewer.fullName}</strong>: {review.comment}{" "}
                  (⭐ {review.rating})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Send Request Section */}
        <div className="mt-8 p-4 border rounded-lg bg-white dark:bg-gray-900">
          <h2 className="text-2xl font-semibold mb-2">Join this Trip?</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded-md w-full mb-2"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </section>
  );
}
