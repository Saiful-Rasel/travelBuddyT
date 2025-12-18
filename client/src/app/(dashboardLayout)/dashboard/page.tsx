"use server"

import { getUserInfo } from "@/service/auth/getUserInfo";


export default async function UserDashboard() {
  const user = await getUserInfo();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 md:p-12">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Welcome to your dashboard,
        </h1>
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-4">
          {user?.fullName}
        </h2>
        <p className="text-gray-500 text-sm md:text-base mb-8">{user?.email}</p>
     
      </div>
    </div>
  );
}
