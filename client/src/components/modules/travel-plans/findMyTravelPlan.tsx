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
import { getCookie } from "@/service/auth/tokenHandler";
import { TravelPlan } from "@/components/types/travelPlan";





export default function MyTravelPlans({ plans }: { plans: TravelPlan[] }) {
  const [plansList, setPlansList] = useState<TravelPlan[]>(plans);
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ================= MATCH REQUEST ================= */

  const handleRequestAction = async (
    requestId: number,
    action: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      const token = await getCookie("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/match-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!res.ok) throw new Error("Failed to update request");

      setPlansList((prev) =>
        prev.map((plan) => ({
          ...plan,
          matchRequests: (plan.matchRequests ?? []).map((req) =>
            req.id === requestId ? { ...req, status: action } : req
          ),
        }))
      );

      toast.success(`Request ${action.toLowerCase()} successfully`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (plan: TravelPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  /* ================= UPDATE (🔥 FIXED PART) ================= */

  const handleUpdate = async (formData: FormData) => {
    if (!selectedPlan) return;

    try {
      const token = await getCookie("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/${selectedPlan.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const { data: updatedData } = await res.json();

      setPlansList((prev) =>
        prev.map((plan) =>
          plan.id === selectedPlan.id
            ? {
                ...plan,        // keep old relations
                ...updatedData, // override only updated fields
              }
            : plan
        )
      );

      toast.success("Travel plan updated successfully");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  /* ================= DELETE ================= */

  const deleteTravelPlan = async (id: number) => {
    try {
      const token = await getCookie("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setPlansList((prev) => prev.filter((plan) => plan.id !== id));
      toast.success("Travel plan deleted");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center mb-8">My Travel Plans</h1>

      {plansList.length === 0 ? (
        <div className="text-center mt-20 space-y-4">
          <p className="text-muted-foreground text-xl">
            You have no travel plans
          </p>
          <Link
            href="/dashboard/create-travelplan"
            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md"
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
            >
              <Card className="rounded-2xl shadow">
                <CardContent className="p-5 space-y-4">
                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
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
                        <h2 className="font-semibold text-lg">{plan.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {plan.destination}
                        </p>
                      </div>
                    </div>
                    <Badge>{plan.travelType}</Badge>
                  </div>

                  <p className="text-sm">
                    📅 {new Date(plan.startDate).toDateString()} –{" "}
                    {new Date(plan.endDate).toDateString()}
                  </p>

                  <p className="text-sm">
                    💰 Budget: {plan.minBudget ?? 0} – {plan.maxBudget ?? 0} BDT
                  </p>

                  {plan.description && (
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(plan)}>
                      Edit
                    </Button>
                    <DeleteTravelPlanDialog
                      planId={plan.id}
                      planTitle={plan.title}
                      onDelete={deleteTravelPlan}
                    />
                  </div>

                  <Separator />

                  {/* MATCH REQUESTS */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      Requests ({(plan.matchRequests ?? []).length})
                    </h3>

                    {(plan.matchRequests ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No requests yet
                      </p>
                    ) : (
                      (plan.matchRequests ?? []).map((req) => (
                        <div
                          key={req.id}
                          className="flex justify-between items-center border rounded-xl p-3"
                        >
                          <div className="flex gap-3 items-center">
                            <Image
                              src={req.sender.profileImage || "/avatar.png"}
                              alt={req.sender.fullName}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-medium">
                                {req.sender.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {req.message}
                              </p>
                            </div>
                          </div>

                          {req.status === "PENDING" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleRequestAction(req.id, "ACCEPTED")
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleRequestAction(req.id, "REJECTED")
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Badge
                              variant={
                                req.status === "ACCEPTED"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {req.status}
                            </Badge>
                          )}
                        </div>
                      ))
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
