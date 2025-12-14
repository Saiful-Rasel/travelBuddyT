"use client";

import TravelPlanCard from "@/components/modules/travel-plans/travelPlanCard";
import { TravelPlan } from "@/components/types/travelPlan";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  travelPlans: TravelPlan[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function TravelPlansClient({ travelPlans, meta }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || meta.page);
  const [plans, setPlans] = useState(travelPlans);

  const totalPages = Math.ceil(meta.total / meta.limit);

  const fetchPageData = async (page: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/travel-plans/feed?page=${page}&limit=${meta.limit}`,
      { cache: "no-store" }
    );
    const result = await res.json();
    setPlans(result.data.data);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    // URL update
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.replace(`${window.location.pathname}?${params.toString()}`);

    // Fetch new data with proper limit
    fetchPageData(page);
  };

  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="text-center max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          All Travel Plans
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Browse all available travel plans and find your next adventure 🌍
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <TravelPlanCard key={plan.id} {...plan} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-3 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {plans.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No travel plans found.
        </p>
      )}
    </section>
  );
}
