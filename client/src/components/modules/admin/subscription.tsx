/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getCookie } from "@/service/auth/tokenHandler";
import { Trash2 } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
}

interface Props {
  initialSubscribers: Subscriber[];
}

export default function SubscriberTable({ initialSubscribers }: Props) {
  const [subscribers, setSubscribers] =
    useState<Subscriber[]>(initialSubscribers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setLoadingId(id);
      const token = await getCookie("accessToken");
      if (!token) {
        toast.error("You are not authorized!");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newsletter/admin/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );
   

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete subscriber");
      }

      toast.success("Subscriber deleted successfully");
      setSubscribers(subscribers.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Delete failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {subscribers.map((sub) => (
            <tr key={sub.id}>
              <td className="px-4 py-2 break-all text-gray-900 dark:text-gray-100">
                {sub.email}
              </td>
              <td className="px-4 w-[50px] py-2 text-center">
                <button
                  disabled={loadingId === sub.id}
                  className={`px-3 py-1 rounded flex items-center justify-center gap-1 ${
                    loadingId === sub.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  onClick={() => handleDelete(sub.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {subscribers.length === 0 && (
        <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
          No subscribers found.
        </p>
      )}
    </div>
  );
}
