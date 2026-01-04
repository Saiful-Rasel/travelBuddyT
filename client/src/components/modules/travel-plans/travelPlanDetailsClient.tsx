/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { getCookie } from "@/service/auth/tokenHandler";
import {
  FiSend,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiClipboard,
  FiStar,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

interface User {
  id: number;
  fullName: string;
}

interface Review {
  id: number;
  reviewerId: number;
  travelPlanId: number;
  rating: number;
  comment?: string;
  reviewer?: { id: number; fullName: string }; // optional to prevent undefined
}

interface TravelPlan {
  id: number;
  userId: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget: number;
  maxBudget: number;
  travelType: string;
  description: string;
  isActive: boolean;
  itinerary: { day: number; activity: string }[];
  image?: string | null;
  user: { id: number; fullName: string; profileImage?: string | null };
  reviews?: Review[];
}

interface Props {
  plan: TravelPlan;
  currentUser: User | null;
}

export default function TravelPlanDetailsClient({ plan, currentUser }: Props) {
  const [reviews, setReviews] = useState<Review[]>(plan.reviews || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("I want to join your trip");

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Match request
  const handleSendRequest = async () => {
    if (!currentUser)
      return toast.error("You must be logged in to send a request");

    setLoading(true);
    try {
      const token = await getCookie("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/match-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: currentUser.id,
            travelPlanId: plan.id,
            message,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send request");
      }

      toast.success("Request sent successfully!");
      setMessage("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Create / Update review
  const handleSubmitReview = async () => {
    if (!currentUser) return toast.error("Login to submit a review");
    setReviewLoading(true);

    try {
      const token = await getCookie("accessToken");
      const payload = {
        reviewedId: plan.userId,
        travelPlanId: plan.id,
        rating,
        comment,
      };

      const method = editingReviewId ? "PATCH" : "POST";
      const url = editingReviewId
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${editingReviewId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit review");
      }

      const newReview = await res.json();

      if (editingReviewId) {
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReviewId ? newReview.data : r))
        );
        setEditingReviewId(null);
      } else {
        setReviews((prev) => [...prev, newReview.data]);
      }

      setRating(5);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: number) => {
    if (!currentUser) return;
    setReviewLoading(true);
    try {
      const token = await getCookie("accessToken");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete review");

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review deleted");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  // Check if currentUser already reviewed
  const existingReview = currentUser
    ? reviews.find((r) => r.reviewerId === currentUser.id)
    : null;

  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {plan.title}
        </h1>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300">{plan.description}</p>

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <FiMapPin className="text-blue-600" /> <strong>Destination:</strong>{" "}
            {plan.destination}
          </p>
          <p className="flex items-center gap-2">
            <FiCalendar className="text-green-600" />{" "}
            <strong>Travel Dates:</strong> {formatDate(plan.startDate)} -{" "}
            {formatDate(plan.endDate)}
          </p>
          <p className="flex items-center gap-2">
            <FiDollarSign className="text-yellow-600" />{" "}
            <strong>Budget:</strong> {plan.minBudget} - {plan.maxBudget}
          </p>
          <p className="flex items-center gap-2">
            <FiClipboard className="text-purple-600" />{" "}
            <strong>Travel Type:</strong> {plan.travelType}
          </p>
        </div>

        {/* Image */}
        {plan.image && (
          <Image
            src={plan.image}
            alt={plan.title}
            width={800}
            height={400}
            className="w-full rounded-lg object-cover shadow-md"
          />
        )}

        {/* Itinerary */}
        {plan.itinerary?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <FiClipboard /> Itinerary
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              {plan.itinerary.map((item) => (
                <li key={item.day}>
                  <strong>Day {item.day}:</strong> {item.activity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Creator */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex items-center gap-3">
          <FiUser className="text-indigo-500 text-2xl" />
          <div>
            <h2 className="text-xl font-semibold">Created By</h2>
            <p>{plan.user.fullName}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md space-y-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FiStar /> Reviews
          </h2>

          {/* Review Form */}
          {currentUser && !plan.isActive && (
            <div className="flex flex-col gap-2 border p-3 rounded-md">
              {existingReview ? (
                // --- If review already exists, show it with edit & delete ---
                <>
                  <span className="font-semibold">Your Review</span>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        disabled={editingReviewId !== existingReview.id}
                      >
                        <span
                          className={`text-2xl ${
                            star <=
                            (editingReviewId === existingReview.id
                              ? rating
                              : existingReview.rating)
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={
                      editingReviewId === existingReview.id
                        ? comment
                        : existingReview.comment || ""
                    }
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-2 rounded-md w-full dark:bg-gray-800 dark:text-white"
                    rows={3}
                    disabled={editingReviewId !== existingReview.id}
                  />
                  <div className="flex gap-2">
                    {editingReviewId === existingReview.id ? (
                      <button
                        onClick={handleSubmitReview}
                        disabled={reviewLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Update Review
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingReviewId(existingReview.id);
                          setRating(existingReview.rating);
                          setComment(existingReview.comment || "");
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(existingReview.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                // --- If no review, show create form ---
                <>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                      >
                        <span
                          className={`text-2xl ${
                            star <= rating ? "text-yellow-400" : "text-gray-400"
                          }`}
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    className="border p-2 rounded-md w-full dark:bg-gray-800 dark:text-white"
                    rows={3}
                  />
                  <button
                    disabled={reviewLoading}
                    onClick={handleSubmitReview}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </>
              )}
            </div>
          )}

          {/* All reviews */}
          <ul className="space-y-2">
            {reviews.map((rev) => (
              <li
                key={rev.id}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-1"
              >
                <span className="font-semibold">
                  {rev.reviewer?.fullName || "Unknown User"}
                </span>
                <span>⭐ {rev.rating}</span>
                <p>{rev.comment || "-"}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Join Trip */}
        {plan.isActive && currentUser && (
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
              <FiSend /> Join this Trip?
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 rounded-md w-full mb-2 dark:bg-gray-800 dark:text-white"
              rows={3}
            />
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <FiSend /> Send Request
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
