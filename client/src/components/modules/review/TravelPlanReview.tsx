/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Review } from "@/components/types/travelPlan";
import { User } from "@/components/types/user";
import { getCookie } from "@/service/auth/tokenHandler";
import { toast } from "sonner";
import { FiStar } from "react-icons/fi";

interface Props {
  planId: number;
  planOwnerId: number;
  currentUser: User | null;
  isPlanInactive?: boolean; // review allowed only if plan is inactive
}

export default function TravelPlanReviewsClient({
  planId,
  planOwnerId,
  currentUser,
  isPlanInactive = false,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  // fetch all reviews for this travel plan
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${planId}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data.data ?? []);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [planId]);

  // check if current user already reviewed
  const existingReview = currentUser
    ? reviews.find((r) => r.reviewer?.id === currentUser.id) ?? null
    : null;

  // prefill form if editing
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment ?? "");
      setEditingReviewId(existingReview.id);
    } else {
      setRating(5);
      setComment("");
      setEditingReviewId(null);
    }
  }, [existingReview]);

  // user can create if inactive & no existing review
  const canCreateReview =  !existingReview;
  // user can edit if inactive & has existing review
  const canEditReview = existingReview;

  const handleSubmitReview = async () => {
    if (!currentUser) return toast.error("Login to submit a review");
    setReviewLoading(true);
    try {
      const token = await getCookie("accessToken");
      const payload = { reviewedId: planOwnerId, travelPlanId: planId, rating, comment };
      const url = editingReviewId
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${editingReviewId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews`;

      const method = editingReviewId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      const newReview = (await res.json()).data;

      if (editingReviewId) {
        setReviews((prev) => prev.map((r) => (r.id === editingReviewId ? newReview : r)));
      } else {
        setReviews((prev) => [...prev, newReview]);
      }

      toast.success("Review submitted!");
      setRating(5);
      setComment("");
      setEditingReviewId(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!currentUser || !existingReview) return;
    setReviewLoading(true);
    try {
      const token = await getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${existingReview.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r.id !== existingReview.id));
      toast.success("Review deleted");
      setRating(5);
      setComment("");
      setEditingReviewId(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <FiStar /> Reviews
      </h2>

      {/* Show form only for plan owner / reviewer */}
      {(canCreateReview || canEditReview) && (
        <div className="flex flex-col gap-2 border p-3 rounded-md dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}>
                <span className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}>★</span>
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Write your review..."
            className="border p-2 rounded-md w-full dark:bg-gray-800 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitReview}
              disabled={reviewLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {editingReviewId ? "Update" : "Submit"}
            </button>
            {canEditReview && (
              <button
                onClick={handleDeleteReview}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Show all reviews */}
      <ul className="space-y-2">
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <li key={r.id} className="p-3 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-1">
              <span className="font-semibold">{r.reviewer?.fullName}</span>
              <span>⭐ {r.rating}</span>
              <p>{r.comment || "-"}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
