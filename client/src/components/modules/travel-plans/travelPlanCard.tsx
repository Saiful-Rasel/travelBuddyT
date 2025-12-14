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
  description?: string;
  image?: string | null;
  reviews?: Review[];
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
  description,
  image,
  reviews,
}: TravelPlanCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden w-full md:w-96 hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      {image ? (
        <div className="relative w-full h-64">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-56 md:h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-300">No Image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white mb-1">{title}</h3>

        {/* Destination */}
        <p className="text-md text-gray-600 dark:text-gray-400 mb-2">{destination}</p>

        {/* Dates */}
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
          📅 {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </p>

        {/* Budget */}
        <p className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">
          💰 Budget: {minBudget}-{maxBudget} BDT
        </p>

        {/* Travel Type */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          🧭 Type: {travelType}
        </p>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900 rounded-md p-2 mb-2 text-sm text-yellow-800 dark:text-yellow-300">
            ⭐ {reviews[0].rating} - {reviews[0].comment}
          </div>
        )}

        {/* See Details */}
        <Link
          href={`/travel-plans/${id}`}
          className="mt-2 inline-block text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm"
        >
          See Details →
        </Link>
      </div>
    </div>
  );
}
