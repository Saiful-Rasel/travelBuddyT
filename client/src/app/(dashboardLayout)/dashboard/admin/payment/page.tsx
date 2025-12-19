/* eslint-disable @typescript-eslint/no-explicit-any */
import PaymentTableClient from "@/components/modules/admin/paymentTable";
import { getCookie } from "@/service/auth/tokenHandler";

interface Payment {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default async function PaymentsPage() {
  const token = await getCookie("accessToken");

  if (!token) {
    return <div className="text-center text-red-500">Not authorized</div>;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/payments`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let payments: Payment[] = [];

    if (res.ok) {
      const data = await res.json();
      payments = Array.isArray(data.data) ? data.data : [];
    } else {
      const errText = await res.text();
      console.error("Payments API error:", errText);
      // optional: 404 er khetre empty array
      if (!errText.includes("No payments found")) throw new Error("Failed to fetch payments");
      payments = [];
    }

    if (payments.length === 0) {
      return <div className="text-center text-gray-500 py-10">No payments available</div>;
    }

    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4 text-center">Payments Dashboard</h1>
        <PaymentTableClient initialPayments={payments} />
      </div>
    );
  } catch (err: any) {
    console.error(err);
    return <div className="text-center text-red-500">Failed to load payments</div>;
  }
}
