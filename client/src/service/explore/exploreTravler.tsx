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
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-900"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-black dark:text-white pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="md:text-3xl text-center font-bold mb-6">Explore Travelers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-5 rounded-lg border bg-white border-gray-200 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-800"
            >
              <Image
                src={user.profileImage || "/images/download.png"}
                alt={user.fullName}
                width={120}
                height={120}
                className="rounded-full mx-auto border border-gray-300 dark:border-gray-700 w-28 h-28 object-cover"
              />

              <h3 className="mt-4 text-lg font-semibold text-center">
                {user.fullName}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                📍 {user.currentLocation || "Unknown"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {user.travelInterests?.length > 0 ? (
                  user.travelInterests.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs rounded-md px-2 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">
                    No interests
                  </span>
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

        <div className="flex justify-center mt-10 gap-2 items-center">
          {page > 1 && (
            <button
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Previous
            </button>
          )}

          {renderPageNumbers()}

          {page < totalPages && (
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
