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
    const token = await getCookie("accessToken")
  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/payments`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch payments");
    }

    const data = await res.json();
    const payments: Payment[] = data.data || [];

    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4 text-center">Payments Dashboard</h1>
        <PaymentTableClient initialPayments={payments} />
      </div>
    );
  } catch (err) {
    console.error(err);
    return <div className="text-center text-red-500">Failed to load payments</div>;
  }
}
