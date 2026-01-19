/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteModal from "./confirmDeleteUser";
import { getCookie } from "@/service/auth/tokenHandler";

export default function UserTableClient({ initialUsers }: any) {
  const [users, setUsers] = useState(initialUsers || []);
  const [searchEmail, setSearchEmail] = useState("");

  const filteredUsers = users.filter((user: any) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const toggleRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const token = await getCookie("accessToken");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    <div className="relative w-full max-w-full overflow-hidden">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
        <h2 className="text-lg font-bold">User Management</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="font-semibold text-sm hidden sm:block">Search:</label>
          <input
            type="text"
            placeholder="Search by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border border-blue-400 bg-blue-50 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-400 rounded px-3 py-2 shadow-sm w-full sm:w-64 text-sm outline-none"
          />
        </div>
      </div>

      <div className="block lg:hidden space-y-4">
        {filteredUsers.map((user: any) => (
          <div key={user.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">ID: {user.id}</p>
                <p className="font-bold text-base">{user.fullName}</p>
                <p className="text-sm text-gray-600 break-all">{user.email}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {user.role}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  user.premium ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}>
                  {user.premium ? "Premium" : "Free"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-9"
                onClick={() => toggleRole(user.id, user.role)}
              >
                {user.role === "ADMIN" ? "Make User" : "Make Admin"}
              </Button>
              <div className="flex-1">
                <ConfirmDeleteModal
                  userId={user.id}
                  userName={user.fullName}
                  onDeleted={() => setUsers(users.filter((u: any) => u.id !== user.id))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border-b px-4 py-3 text-left font-semibold">ID</th>
              <th className="border-b px-4 py-3 text-left font-semibold">Name</th>
              <th className="border-b px-4 py-3 text-left font-semibold">Email</th>
              <th className="border-b px-4 py-3 text-center font-semibold">Role</th>
              <th className="border-b px-4 py-3 text-center font-semibold">Status</th>
              <th className="border-b px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500">{user.id}</td>
                <td className="px-4 py-3 font-medium">{user.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.premium ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {user.premium ? "Premium" : "Free"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs h-8"
                      onClick={() => toggleRole(user.id, user.role)}
                    >
                      {user.role === "ADMIN" ? "Demote" : "Promote"}
                    </Button>
                    <ConfirmDeleteModal
                      userId={user.id}
                      userName={user.fullName}
                      onDeleted={() => setUsers(users.filter((u: any) => u.id !== user.id))}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-10 border rounded-lg bg-gray-50 mt-4">
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}
    </div>
  );
}