/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

export default function AdminStats({ stats }: { stats: StatsData }) {
  if (!stats) return <p className="text-red-500">Failed to load stats</p>;

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
    <div className={`rounded-2xl p-5 text-white shadow-lg ${gradient}`}>
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

  return (
    <div className="space-y-6">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600" />

        <StatCard title="Premium Users" value={stats.totalPremiumUsers} icon={Crown}
          gradient="bg-gradient-to-r from-purple-500 to-pink-500" />

        <StatCard title="Total Payments" value={stats.totalPayments} icon={CreditCard}
          gradient="bg-gradient-to-r from-indigo-500 to-indigo-600" />

        <StatCard title="Successful Payments" value={stats.totalSuccessfulPayments}
          icon={CheckCircle}
          gradient="bg-gradient-to-r from-green-500 to-emerald-500" />

        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`}
          icon={DollarSign}
          gradient="bg-gradient-to-r from-orange-500 to-red-500" />
      </div>
    </div>
  );
}
