"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/components/types/user";

interface Payment {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  status: string;
  createdAt: string;
    user?: User;
}

interface PaymentTableClientProps {
  initialPayments: Payment[];
}

export default function PaymentTableClient({ initialPayments }: PaymentTableClientProps) {
  const [payments, setPayments] = useState(initialPayments || []);
  console.log(payments)

  const markSuccess = async (paymentId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${paymentId}/updatePayment`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId ? { ...p, status: "SUCCESS" } : p
          )
        );
        toast.success("Payment marked as SUCCESS");
      } else {
        toast.error(`Failed to update payment: ${data.message}`);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-4 py-3">{payment.id}</td>
              <td className="px-4 py-3">{payment?.user?.fullName}</td>
              <td className="px-4 py-3 text-right">${payment.amount}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(payment.status)}`}>
                  {payment.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {payment.status === "PENDING" && (
                  <Button size="sm" onClick={() => markSuccess(payment.id)}>
                    Mark Success
                  </Button>
                )}
                {payment.status === "CANCELLED" && (
                  <span className="text-gray-500 text-sm">Not allowed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
