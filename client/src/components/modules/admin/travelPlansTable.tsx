/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Eye, ShieldAlert, ShieldCheck } from "lucide-react";
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

  const handleUpdate = async (data: FormData) => {
    const token = await getCookie("accessToken");
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
    <div className="bg-white p-2 sm:p-4 rounded-lg w-full">
      <div className="flex flex-row justify-between items-center mb-6 gap-2 px-1">
        <h2 className="text-xl font-bold text-gray-800">Travel Plans</h2>
        <AdminCreateButton />
      </div>

      {/* --- Mobile Card View --- */}
      <div className="block lg:hidden space-y-4">
        {plansList.map((plan) => (
          <div key={plan.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex gap-4 mb-4">
              <Image
                src={plan.image || "/images/download.jpeg"}
                alt={plan.title}
                width={80}
                height={80}
                className="rounded-lg object-cover h-20 w-20 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base truncate">{plan.title}</h3>
                <p className="text-sm text-gray-500 truncate mb-1">{plan.destination}</p>
                <div className="flex gap-2 items-center">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    plan.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {plan.isActive ? "Active" : "Blocked"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                    {plan.travelType}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-y py-3 mb-4">
              <div>
                <p className="text-gray-400 mb-1">Budget Range</p>
                <p className="font-semibold text-gray-700">৳{plan.minBudget} - ৳{plan.maxBudget}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Posted By</p>
                <div className="flex items-center gap-1">
                  <Image
                    src={plan.user?.profileImage || "/images/download.png"}
                    alt="User"
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                  <span className="truncate font-semibold">{plan.user?.fullName || "User"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setIsOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-1 bg-gray-50 text-blue-600 py-2 rounded-lg text-sm font-medium border"
              >
                <Eye size={16} /> View
              </button>
              
              <button
                onClick={() => handleBlockUnblock(plan)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium border ${
                  plan.isActive ? "text-orange-600 bg-orange-50 border-orange-100" : "text-green-600 bg-green-50 border-green-100"
                }`}
              >
                {plan.isActive ? <ShieldAlert size={16}/> : <ShieldCheck size={16}/>}
                {plan.isActive ? "Block" : "Unblock"}
              </button>

              <div className="flex-shrink-0">
                <DeleteTravelPlanDialog
                  planId={plan.id}
                  planTitle={plan.title}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="p-4 text-left font-semibold">Plan Details</th>
              <th className="p-4 text-left font-semibold">User</th>
              <th className="p-4 text-center font-semibold">Type</th>
              <th className="p-4 text-center font-semibold">Budget</th>
              <th className="p-4 text-center font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {plansList.map((plan) => (
              <tr key={plan.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={plan.image || "/images/download.jpeg"}
                      alt={plan.title}
                      width={44}
                      height={44}
                      className="rounded-lg object-cover flex-shrink-0 shadow-sm"
                    />
                    <div className="max-w-[180px]">
                      <p className="font-bold text-gray-800 truncate">{plan.title}</p>
                      <p className="text-[11px] text-gray-500 truncate">{plan.destination}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={plan.user?.profileImage || "/images/download.png"}
                      alt="User"
                      width={24}
                      height={24}
                      className="rounded-full border"
                    />
                    <span className="font-medium text-gray-700 truncate max-w-[100px]">
                      {plan.user?.fullName || "User"}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                    {plan.travelType}
                  </span>
                </td>
                <td className="p-4 text-center font-semibold text-gray-700">
                   ৳{plan.minBudget} - ৳{plan.maxBudget}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 text-[11px] font-bold rounded-md uppercase ${
                    plan.isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                  }`}>
                    {plan.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => { setSelectedPlan(plan); setIsOpen(true); }}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-blue-600 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleBlockUnblock(plan)}
                      className={`p-2 rounded-lg border transition-colors ${
                        plan.isActive ? "border-orange-200 text-orange-600 hover:bg-orange-50" : "border-green-200 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {plan.isActive ? <ShieldAlert size={18}/> : <ShieldCheck size={18}/>}
                    </button>
                    <DeleteTravelPlanDialog
                      planId={plan.id}
                      planTitle={plan.title}
                      onDelete={handleDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {plansList.length === 0 && (
        <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl mt-4 border-2 border-dashed">
          No travel plans found
        </div>
      )}

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
    </div>
  );
}