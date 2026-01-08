/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";

import { User } from "@/components/types/user";

import {
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiClipboard,
  FiUser,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";
import { getCookie } from "@/service/auth/tokenHandler";
import { toast } from "sonner";
import TravelPlanReviewsClient from "../review/TravelPlanReview";
import { TravelPlan } from "@/components/types/travelPlan";

interface Props {
  plan: TravelPlan;
  currentUser: User | null | undefined;
}

export default function TravelPlanDetailsClient({ plan, currentUser }: Props) {
  const [message, setMessage] = useState("I want to join your trip");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleSendRequest = async () => {
    if (!currentUser) return toast.error("Login required");
    setLoading(true);
    try {
      const token = await getCookie("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/match-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: currentUser.id,
            travelPlanId: plan.id,
            message,
          }),
        }
      );
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      toast.success("Request sent!");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title & Description */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {plan.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">{plan.description}</p>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <FiMapPin className="text-blue-600" /> <strong>Destination:</strong>{" "}
            {plan.destination}
          </p>
          <p className="flex items-center gap-2">
            <FiCalendar className="text-green-600" />{" "}
            <strong>Travel Dates:</strong> {formatDate(plan.startDate)} -{" "}
            {formatDate(plan.endDate)}
          </p>
          <p className="flex items-center gap-2">
            <FiDollarSign className="text-yellow-600" />{" "}
            <strong>Budget:</strong> {plan.minBudget} - {plan.maxBudget}
          </p>
          <p className="flex items-center gap-2">
            <FiClipboard className="text-purple-600" />{" "}
            <strong>Travel Type:</strong> {plan.travelType}
          </p>
        </div>

        {/* Image */}
        {plan.image && (
          <Image
            src={plan.image}
            alt={plan.title}
            width={800}
            height={400}
            className="w-full rounded-lg object-cover shadow-md"
          />
        )}

        {/* Itinerary */}
        {plan.itinerary?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <FiClipboard /> Itinerary
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              {plan.itinerary.map((item) => (
                <li key={item.day}>
                  <strong>Day {item.day}:</strong> {item.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Creator */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex items-center gap-3">
          <FiUser className="text-indigo-500 text-2xl" />
          <div>
            <h2 className="text-xl font-semibold">Created By</h2>
            {plan.user ? <p>{plan.user.fullName}</p> : <p>Unknown User</p>}
          </div>
        </div>

        {/* Reviews */}
        {!plan.isActive ? (
          <TravelPlanReviewsClient
            planId={plan.id}
            currentUser={currentUser ?? null}
            planOwnerId={plan.user?.id ?? 0}
          
          />
        ) : (
          <p className="text-gray-500">
            Reviews will be available after plan ends.
          </p>
        )}

        {/* Join Trip */}
         (
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <FiSend /> Join this Trip?
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 rounded-md w-full mb-2 dark:bg-gray-800 dark:text-white"
              rows={3}
            />
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <FiSend /> Send Request
                </>
              )}
            </button>
          </div>
        )
      </div>
    </section>
  );
}
