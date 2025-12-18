/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import UpdateModal from "./updateTravelPlanModal";
import DeleteTravelPlanDialog from "./deleteTravelPlanModal";

interface MatchRequest {
  id: number;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sender: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
}

interface ItineraryItem {
  day: number;
  activity: string;
}

interface TravelPlan {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  description?: string;
  image?: string | null;
  itinerary?: ItineraryItem[];
  matchRequests?: MatchRequest[];
}

export default function MyTravelPlans({ plans }: { plans: TravelPlan[] }) {
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [plansList, setPlansList] = useState(
    plans.map((plan) => ({
      ...plan,
      itinerary: Array.isArray(plan.itinerary) ? plan.itinerary : [],
      matchRequests: Array.isArray(plan.matchRequests) ? plan.matchRequests : [],
    }))
  );

  const handleRequestAction = async (requestId: number, action: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/match-requests/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update request");
      }

      const data = await res.json();

      setPlansList((prev) =>
        prev.map((plan) => ({
          ...plan,
          matchRequests: plan.matchRequests?.map((req) =>
            req.id === requestId ? { ...req, status: data.action } : req
          ),
        }))
      );

      toast.success(`Request ${action.toLowerCase()} successfully!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update request");
    }
  };

  const handleEdit = (plan: TravelPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data: any) => {
    if (!selectedPlan) return;

    try {
      const raw = data.get("data") as string;
      const parsed = JSON.parse(raw);

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(parsed));

      const file = data.get("file");
      if (file instanceof File) {
        formDataToSend.append("file", file);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/travel-plans/${selectedPlan.id}`,
        {
          method: "PATCH",
          body: formDataToSend,
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Update failed");
      }

      const updatedPlanResponse = await res.json();
      const updatedPlanData = {
        ...updatedPlanResponse.data,
        itinerary: Array.isArray(updatedPlanResponse.data.itinerary)
          ? updatedPlanResponse.data.itinerary
          : [],
        matchRequests: Array.isArray(updatedPlanResponse.data.matchRequests)
          ? updatedPlanResponse.data.matchRequests
          : [],
      };

      setPlansList((prev) =>
        prev.map((plan) => (plan.id === updatedPlanData.id ? updatedPlanData : plan))
      );

      toast.success("Travel plan updated successfully!");
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update travel plan");
    }
  };

  const deleteTravelPlan = async (id: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/travel-plans/${id}`,
      { method: "DELETE", credentials: "include" }
    );
    if (!res.ok) throw new Error("Failed to delete");
    setPlansList((prev) => prev.filter((plan) => plan.id !== id));
  };

  return (
    <section className="min-h-screen w-full bg-zinc-50 dark:bg-black p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Travel Plans</h1>

      {plansList.length === 0 ? (
        <div className="text-center mt-20 space-y-4">
          <p className="text-3xl text-muted-foreground ">You have no travel plans.</p>
          <Link
            href="/dashboard/create-travelplan"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create Travel Plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {plansList.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="rounded-2xl shadow-md">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {plan.image && (
                        <Image
                          src={plan.image}
                          alt={plan.title}
                          width={50}
                          height={50}
                          className="rounded-lg"
                        />
                      )}
                      <div>
                        <h2 className="text-xl font-semibold">{plan.title}</h2>
                        <p className="text-sm text-muted-foreground">{plan.destination}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{plan.travelType}</Badge>
                  </div>

                  <p className="text-sm">
                    📅 {new Date(plan.startDate).toDateString()} –{" "}
                    {new Date(plan.endDate).toDateString()}
                  </p>

                  <p className="text-sm">
                    💰 Budget: {plan.minBudget || 0} – {plan.maxBudget || 0} BDT
                  </p>

                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}

                  {Array.isArray(plan.itinerary) && plan.itinerary.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Itinerary</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {plan.itinerary.map((item) => (
                          <li key={item.day}>
                            Day {item.day}: {item.activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(plan)}>Edit</Button>
                    <DeleteTravelPlanDialog
                      planId={plan.id}
                      planTitle={plan.title}
                      onDelete={deleteTravelPlan}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="font-semibold">
                      Requests ({plan.matchRequests?.length || 0})
                    </h3>

                    {Array.isArray(plan.matchRequests) && plan.matchRequests.length > 0 ? (
                      plan.matchRequests.map((req) => (
                        <div
                          key={req.id}
                          className="flex items-center justify-between rounded-xl border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={req.sender.profileImage || "/avatar.png"}
                              alt={req.sender.fullName}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-medium">{req.sender.fullName}</p>
                              <p className="text-xs text-muted-foreground">{req.message}</p>
                            </div>
                          </div>

                          {req.status === "PENDING" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRequestAction(req.id, "ACCEPTED")}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRequestAction(req.id, "REJECTED")}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Badge
                              variant={req.status === "ACCEPTED" ? "default" : "destructive"}
                            >
                              {req.status}
                            </Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No requests yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <UpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedPlan}
          onSubmit={handleUpdate}
        />
      )}
    </section>
  );
}
