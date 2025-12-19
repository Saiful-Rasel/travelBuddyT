/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { User } from "@/components/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/service/auth/tokenHandler";

interface Props {
  user?: User | null;
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

export default function PremiumItineraryClient({ user, amount = 999 }: Props) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!user) {
      toast.error("Please login first");
      router.push("/login?redirect=/");
      return;
    }

    if (!user.premium) {
      try {
        const token = await getCookie("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token }`,
          },
          body: JSON.stringify({ amount }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Payment initiation failed");
        }

        const responseData = await res.json();
        const paymentUrl = responseData.data?.paymentUrl;

        if (!paymentUrl) {
          toast.error("Payment URL not received");
          return;
        }

        window.location.href = paymentUrl;
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to initiate payment");
      }

      return;
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
        const token = await getCookie("accessToken")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/itinerary`, {
        method: "POST",
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

  if (!user || !user.premium) {
    return (
      <div className="h-[30vh] flex flex-col items-center justify-center rounded-xl bg-blue-600 p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">AI Travel Itinerary</h1>
        <p className="text-white mb-2">{user ? `Hello, ${user.fullName}` : "Login to access the service"}</p>
        <p className="text-white mb-4">Premium service fee: {amount} BDT</p>
        <Button
          size="lg"
          className="bg-white text-black hover:bg-gray-100 rounded-lg"
          onClick={handleUnlock}
        >
          Unlock AI Service
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Your Travel Itinerary</h1>

      <form className="flex gap-2 mb-4" onSubmit={handleGenerateItinerary}>
        <Input
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </form>

      {itinerary && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">
            Destination: {itinerary.destination} ({itinerary.days} days)
          </h2>
          {Object.entries(itinerary.itinerary).map(([day, info]) => (
            <div key={day} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
              <h3 className="font-semibold mb-2 capitalize">{day}</h3>
              <ul className="list-disc list-inside space-y-1">
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
    </div>
  );
}
