/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  users: any[];
  meta: { total: number; limit: number; page?: number };
}

export default function ExploreClient({ users, meta }: Props) {
  const router = useRouter();
  const page = meta.page || 1;
  const limit = meta.limit;
  const totalPages = Math.ceil(meta.total / limit);

  const handlePageChange = (newPage: number) => {
    router.push(`/explore?page=${newPage}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md border ${
            i === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4">
      <h2 className="text-3xl font-bold mb-6">Explore Travelers</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg transition"
          >
            <Image
              src={user.profileImage || "/images/download.png"}
              alt={user.fullName}
              width={120}
              height={120}
              className="rounded-full mx-auto border w-28 h-28 object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold text-center">
              {user.fullName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
              📍 {user.currentLocation || "Unknown"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {user.travelInterests?.length > 0 ? (
                user.travelInterests.map((item: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No interests</span>
              )}
            </div>
            <Link
              href={`/profile/${user.id}`}
              className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-10 gap-2 items-center">
        {page > 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
          >
            Previous
          </button>
        )}

        {renderPageNumbers()}

        {page < totalPages && (
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
