/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/components/types/user";
import { Button } from "@/components/ui/button";

import { getCookie } from "@/service/auth/tokenHandler";

interface Props {
  user?: User | null;
  setUser?: (user: User) => void;
  amount?: number;
}

interface ItineraryDay {
  morning: string;
  afternoon: string;
  evening: string;
  estimatedCost: string;
}

interface ItineraryData {
  destination: string;
  days: number;
  itinerary: Record<string, ItineraryDay>;
}

export default function PremiumItineraryClient({
  user,
  setUser,
  amount = 999,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id"); // payment redirect
  const [destination, setDestination] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);

  // Update currentUser when prop changes
  useEffect(() => {
    setCurrentUser(user || null);
  }, [user]);

  // Handle payment success redirect
  useEffect(() => {
    const updatePremiumStatus = async () => {
      if (tranId && currentUser && !currentUser.premium) {
        try {
          const token = await getCookie("accessToken");
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
            {
              cache: "no-store",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          if (data.success && data.data) {
            setCurrentUser(data.data);
            setUser?.(data.data);
            toast.success("Payment successful! AI service unlocked.");
            router.replace("/");
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    updatePremiumStatus();
  }, [tranId, currentUser, router, setUser]);

  // Initiate payment
  const handleUnlock = async () => {
    if (!currentUser) {
      toast.error("Please login first");
      router.push("/login?redirect=/");
      return;
    }
    if (!currentUser.premium) {
      try {
        const token = await getCookie("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount }),
          }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Payment initiation failed");
        }
        const paymentUrl = (await res.json())?.data?.paymentUrl;
        if (!paymentUrl) {
          toast.error("Payment URL not received");
          return;
        }
        // Redirect to payment gateway
        window.location.href = paymentUrl;
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to initiate payment");
      }
    }
  };

  // Generate AI itinerary
  const handleGenerateItinerary = async (e: FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
    setLoading(true);
    try {
      const token = await getCookie("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/itinerary`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify({ destination }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to generate itinerary");
      }
      const data = await res.json();
      if (data.success && data.data?.data) {
        setItinerary(data.data.data);
      } else {
        throw new Error("No itinerary data received");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-4">
      <h1 className="md:text-2xl font-bold mb-4 md:text-center text-gray-900 dark:text-white">
        AI Travel Itinerary
      </h1>

      {/* Premium check */}
      {currentUser?.premium ? (
        <>
          <div className="w-full flex items-center justify-center">
            <form
              className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center"
              onSubmit={handleGenerateItinerary}
            >
              <input
                type="text"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={loading}
                className="
          flex-1
          px-4 py-2
          rounded-lg
          border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition
          w-full sm:w-[350px] md:w-[400px] lg:w-[450px]
        "
              />

              <button
                type="submit"
                disabled={loading}
                className="
          mt-2 sm:mt-0
          px-4 py-2
          rounded-lg
          bg-blue-500 text-white
          hover:bg-blue-600
          disabled:bg-gray-400 disabled:cursor-not-allowed
          transition
        "
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </form>
          </div>

          {itinerary && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Destination: {itinerary.destination} ({itinerary.days} days)
              </h2>
              {Object.entries(itinerary.itinerary).map(([day, info]) => (
                <div
                  key={day}
                  className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 shadow-sm"
                >
                  <h3 className="font-semibold mb-2 capitalize text-gray-900 dark:text-white">
                    {day}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-300">
                    <li>
                      <strong>Morning:</strong> {info.morning}
                    </li>
                    <li>
                      <strong>Afternoon:</strong> {info.afternoon}
                    </li>
                    <li>
                      <strong>Evening:</strong> {info.evening}
                    </li>
                    <li>
                      <strong>Estimated Cost:</strong> {info.estimatedCost}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="h-[30vh] flex flex-col items-center justify-center rounded-xl bg-blue-600 p-4">
          <p className="text-white mb-2">
            {currentUser
              ? `Hello, ${currentUser.fullName}`
              : "Unlock AI Travel Itinerary"}
          </p>
          <p className="text-white mb-4">Premium service fee: {amount} BDT</p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 rounded-lg"
            onClick={handleUnlock}
          >
            Unlock AI Service
          </Button>
        </div>
      )}
    </div>
  );
}
