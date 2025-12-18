/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Crown,
  CreditCard,
  CheckCircle,
  DollarSign,
} from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalPremiumUsers: number;
  totalPayments: number;
  totalSuccessfulPayments: number;
  totalRevenue: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: number | string;
  icon: any;
  gradient: string;
}) => (
  <div
    className={`rounded-2xl p-5 text-white shadow-lg hover:scale-[1.02] transition ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-white/20 rounded-xl">
        <Icon size={28} />
      </div>
    </div>
  </div>
);

export default function AdminStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/stats`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message);
        }
        return res.json();
      })
      .then((data) => setStats(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Total Users"
          value={stats!.totalUsers}
          icon={Users}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
        />

        <StatCard
          title="Premium Users"
          value={stats!.totalPremiumUsers}
          icon={Crown}
          gradient="bg-gradient-to-r from-purple-500 to-pink-500"
        />

        <StatCard
          title="Total Payments"
          value={stats!.totalPayments}
          icon={CreditCard}
          gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
        />

        <StatCard
          title="Successful Payments"
          value={stats!.totalSuccessfulPayments}
          icon={CheckCircle}
          gradient="bg-gradient-to-r from-green-500 to-emerald-500"
        />

        <StatCard
          title="Total Revenue"
          value={`$${stats!.totalRevenue}`}
          icon={DollarSign}
          gradient="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>
    </div>
  );
}
