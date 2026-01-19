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
  const tranId = searchParams.get("tran_id");
  const [destination, setDestination] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);

  useEffect(() => {
    setCurrentUser(user || null);
  }, [user]);

  useEffect(() => {
    const updatePremiumStatus = async () => {
      if (tranId && currentUser && !currentUser.premium) {
        try {
          const token = await getCookie("accessToken");
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (data.success && data.data) {
            setCurrentUser(data.data);
            setUser?.(data.data);
            toast.success("Payment successful! AI service unlocked.");
            router.replace("/");
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to update premium status.");
        }
      }
    };
    updatePremiumStatus();
  }, [tranId, currentUser, router, setUser]);

  const handleUnlock = async () => {
    if (!currentUser) {
      toast.error("Please login first");
      router.push("/login?redirect=/");
      return;
    }
    if (!currentUser.premium) {
      try {
        const token = await getCookie("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Payment initiation failed");
        }
        const json = await res.json();
        const paymentUrl = json?.data?.paymentUrl;
        if (!paymentUrl) {
          toast.error(json?.data?.tranId ? `Transaction ID: ${json.data.tranId}` : "Payment URL not received");
          return;
        }
        window.location.href = paymentUrl;
      } catch (err: any) {
        toast.error(err.message || "Failed to initiate payment");
      }
    }
  };

  const handleGenerateItinerary = async (e: FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
    setLoading(true);
    try {
      const token = await getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/itinerary`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ destination }),
      });
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
    <div className="mx-auto bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg transition-colors">
      <h1 className="md:text-3xl font-semibold text-center md:text-center text-gray-900 dark:text-white mb-6">
        AI Travel Itinerary
      </h1>

      {currentUser?.premium ? (
        <>
          <form
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center"
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
                px-5 py-3
                rounded-lg
                border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition
                w-full sm:w-[400px] md:w-[450px] lg:w-[500px]
              "
            />
            <button
              type="submit"
              disabled={loading}
              className="
                mt-2 sm:mt-0
                px-6 py-3
                rounded-lg
                bg-blue-600 text-white font-semibold
                hover:bg-blue-700
                disabled:bg-gray-400 disabled:cursor-not-allowed
                transition
              "
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>

          {itinerary && (
            <div className="space-y-5 mt-6">
              {Object.entries(itinerary.itinerary).map(([day, info]) => (
                <div
                  key={day}
                  className="border rounded-xl p-5 bg-gray-50 dark:bg-gray-800 transition-colors"
                >
                  <h3 className="font-semibold mb-3 capitalize text-gray-900 dark:text-white text-lg">
                    {day}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-300">
                    <li><strong>Morning:</strong> {info.morning}</li>
                    <li><strong>Afternoon:</strong> {info.afternoon}</li>
                    <li><strong>Evening:</strong> {info.evening}</li>
                    <li><strong>Estimated Cost:</strong> {info.estimatedCost}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="p-4 flex flex-col items-center justify-center  transition-colors">
          <p className="text-lg text-gray-900 dark:text-white mb-2">
            {currentUser ? `Hello, ${currentUser.fullName}` : "Unlock AI Travel Itinerary"}
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
            Premium service fee: {amount} BDT
          </p>
          <Button
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-3 font-semibold shadow-md transition"
            onClick={handleUnlock}
          >
            Unlock AI Service
          </Button>
        </div>
      )}
    </div>
  );
}
