/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteModal from "./confirmDeleteUser";

export default function UserTableClient({ initialUsers }: any) {
  const [users, setUsers] = useState(initialUsers || []);
  const [searchEmail, setSearchEmail] = useState("");

  const filteredUsers = users.filter((user: any) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const toggleRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setUsers((prev: any[]) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );

        toast.success(`Role updated to ${newRole} for ${data.data.fullName}`);
      } else {
        toast.error(`Failed to update role: ${data.message}`);
      }
    } catch (err: any) {
      toast.error("Something went wrong while updating role!");
      console.error(err);
    }
  };

 

  return (
    <div className="relative">
      {/* Search */}
      <div className="mb-4 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2">
        <label className="font-bold text-[16px] sm:text-[18px]">Search:</label>
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border border-blue-400 bg-blue-50 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-400 rounded px-3 py-1 shadow-md w-full sm:w-64 text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="border bg-gray-100">
              <th className="border px-2 py-2 whitespace-nowrap w-[120px]">
                ID
              </th>
              <th className="border px-2 py-2 whitespace-nowrap w-[200px]">
                Name
              </th>
              <th className="border px-6 py-2 md:w-[25%]  break-all whitespace-normal">
                Email
              </th>
              <th className="border px-2 py-2 whitespace-nowrap w-[120px]">
                Role
              </th>
              <th className="border px-2 py-2 whitespace-nowrap md:w-[80px] w-[50px]">
                Premium
              </th>
              <th className="border px-2 py-2 md:w-[300px] w-[200px] ">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="border">
                {/* ID */}
                <td className="border px-2 py-2 whitespace-nowrap">
                  {user.id}
                </td>

                {/* Name – only required width */}
                <td className="border px-2 py-2 font-medium whitespace-nowrap w-auto">
                  {user.fullName}
                </td>

                {/* Email – more padding & flexible width */}
                <td className="border px-6 py-2 text-left">{user.email}</td>

                {/* Role – auto width */}
                <td className="border px-2 py-2 whitespace-nowrap w-auto">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Premium – auto width */}
                <td className="border px-2 py-2 whitespace-nowrap w-auto">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      user.premium
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.premium ? "Premium" : "Free"}
                  </span>
                </td>

                {/* Actions */}
                <td className="border px-1 py-2 text-center ">
                  <div className="flex flex-col sm:flex-row md:gap-10 gap-2 justify-center ">
                    <Button
                      size="sm"
                      className="text-xs md:text-[12px]"
                      onClick={() => toggleRole(user.id, user.role)}
                    >
                      {user.role === "ADMIN" ? "Create User" : "Create Admin"}
                    </Button>

                    <ConfirmDeleteModal
                      userId={user.id}
                      userName={user.fullName}
                      onDeleted={() =>
                        setUsers(users.filter((u:any) => u.id !== user.id))
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
