"use client";

import Image from "next/image";
import Link from "next/link";

interface Reviewer {
  id: number;
  fullName: string;
  profileImage?: string | null;
}

interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  reviewer: Reviewer;
}

interface TravelPlanCardProps {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  image?: string | null;
  reviews?: Review[];
  isActive: boolean;
}

export default function TravelPlanCard({
  id,
  title,
  destination,
  startDate,
  endDate,
  minBudget,
  maxBudget,
  travelType,
  image,
  reviews = [],
  isActive,
}: TravelPlanCardProps) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900
        rounded-xl shadow-lg overflow-hidden
        hover:shadow-2xl transition-all duration-300
        flex flex-col h-full
      "
    >
      {/* ================= Image Section ================= */}
      <div className="relative w-full h-64 flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-300 text-sm">
              No Image
            </span>
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold
            ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* ================= Content Section ================= */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
          {title}
        </h3>

        {/* Destination */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {destination}
        </p>

        {/* Date */}
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          📅 {new Date(startDate).toLocaleDateString()} –{" "}
          {new Date(endDate).toLocaleDateString()}
        </p>

        {/* Budget */}
        {minBudget !== undefined && maxBudget !== undefined && (
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
            💰 {minBudget} – {maxBudget} BDT
          </p>
        )}

        {/* Travel Type */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          🧭 {travelType}
        </p>

        {/* ================= Reviews Section ================= */}
        {!isActive && (
          <div className="pt-3 space-y-2 max-h-28 overflow-hidden">
           

            {reviews.length > 1 && (
              <Link
                href={`/travel-plans/${id}`}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                See all {reviews.length} reviews →
              </Link>
            )}
          </div>
        )}

       
        <div className="mt-auto pt-4">
          <Link
            href={`/travel-plans/${id}`}
            className="text-blue-600 dark:text-blue-400
                       text-sm font-medium hover:underline"
          >
            See Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
