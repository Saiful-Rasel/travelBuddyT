/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import UpdateModal from "../travel-plans/updateTravelPlanModal";
import { useState } from "react";
import { toast } from "sonner";
import AdminCreateButton from "./createModalTravelPlan";
import DeleteTravelPlanDialog from "../travel-plans/deleteTravelPlanModal";
import { getCookie } from "@/service/auth/tokenHandler";
import { TravelPlan } from "@/components/types/travelPlan";
import { User } from "@/components/types/user";




interface TravelPlansTableProps {
  travelPlans: TravelPlan[];
  user?: User | null;
}

export default function TravelPlansTable({
  travelPlans,
}: TravelPlansTableProps) {
  const [plansList, setPlansList] = useState<TravelPlan[]>(travelPlans);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);

  // ================= UPDATE HANDLER =================
  const handleUpdate = async (data: FormData) => {
    const token = await getCookie("accessToken")
    if (!selectedPlan) return;
    try {
      const raw = data.get("data") as string;
      const parsed = JSON.parse(raw);

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(parsed));

      const file = data.get("file");
      if (file instanceof File) formDataToSend.append("file", file);

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/${selectedPlan.id}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
        cache: "no-store",
      });

      if (!res.ok)
        throw new Error((await res.text()) || "Failed to update travel plan");

      const updatedPlan = (await res.json()).data;
      setPlansList((prev) =>
        prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
      );

      toast.success("Travel plan updated successfully!");
      setIsOpen(false);
      setSelectedPlan(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update travel plan");
    }
  };

  // ================= BLOCK / UNBLOCK =================
  const handleBlockUnblock = async (plan: TravelPlan) => {
    const token = await getCookie("accessToken");
    try {
      const url = plan.isActive
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/travel-plans/${plan.id}/block`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/travel-plans/${plan.id}/unblock`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error((await res.text()) || "Action failed");

      setPlansList((prev) =>
        prev.map((p) =>
          p.id === plan.id ? { ...p, isActive: !p.isActive } : p
        )
      );
      toast.success(
        plan.isActive ? "Travel plan blocked" : "Travel plan unblocked"
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update status");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    const token = await getCookie("accessToken");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error((await res.text()) || "Delete failed");

      setPlansList((prev) => prev.filter((p) => p.id !== id));
      toast.success("Travel plan deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete travel plan");
    }
  };

  return (
    <>
      {/* ================= HEADER / CREATE BUTTON ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg font-medium">Travel Plans</h2>
        <AdminCreateButton />
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow">
        <table className="w-full text-sm table-fixed min-w-[700px] sm:min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3">User</th>
              <th className="p-3">Type</th>
              <th className="p-3">Date</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plansList.map((plan) => (
              <tr
                key={plan.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <Image
                      src={plan.image || "/images/download.jpeg"}
                      alt={plan.title}
                      width={48}
                      height={48}
                      className="rounded-md object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">{plan.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {plan.destination}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <Image
                      src={plan.user?.profileImage || "/images/download.png"}
                      alt={plan.user?.fullName || "Unknown User"}
                      width={28}
                      height={28}
                      className="rounded-full flex-shrink-0"
                    />
                    <span className="truncate">
                      {plan.user?.fullName || "Unknown User"}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {plan.travelType}
                  </span>
                </td>
                <td className="p-3 text-center text-xs">
                  {new Date(plan.startDate).toLocaleDateString()}
                  <br />–<br />
                  {new Date(plan.endDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                  ৳{plan.minBudget} – ৳{plan.maxBudget}
                </td>
                <td className="p-3 text-center">
                  {plan.isActive ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                      Blocked
                    </span>
                  )}
                </td>
                <td className="p-3 text-center text-xs">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-center flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsOpen(true);
                    }}
                    className="p-2 rounded hover:bg-blue-100 text-blue-600"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleBlockUnblock(plan)}
                    className={`p-2 rounded ${
                      plan.isActive
                        ? "hover:bg-red-100 text-red-600"
                        : "hover:bg-green-100 text-green-700"
                    }`}
                  >
                    {plan.isActive ? "Block" : "Unblock"}
                  </button>

                  <DeleteTravelPlanDialog
                    planId={plan.id}
                    planTitle={plan.title}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}

            {plansList.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No travel plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      {isOpen && selectedPlan && (
        <UpdateModal
          isOpen={isOpen}
          initialData={selectedPlan}
          onSubmit={handleUpdate}
          onClose={() => {
            setIsOpen(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </>
  );
}
