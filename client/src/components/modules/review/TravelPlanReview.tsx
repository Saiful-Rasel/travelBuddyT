/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Review } from "@/components/types/travelPlan";
import { User } from "@/components/types/user";
import { getCookie } from "@/service/auth/tokenHandler";
import { toast } from "sonner";
import { FiStar } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import EditModal from "./TravelPlanReviewEditModal";
import DeleteModal from "./ReviewDeleteModal";

interface Props {
  planId: number;
  planOwnerId: number;
  currentUser: User | null;
}

export default function TravelPlanReviewsClient({
  planId,
  planOwnerId,
  currentUser,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [acceptedUserIds, setAcceptedUserIds] = useState<number[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${planId}`
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.data ?? []);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [planId]);

  useEffect(() => {
    const fetchAcceptedUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/travel-plans/acceptedusers/${planId}`
        );
        if (!res.ok) throw new Error("Failed to fetch accepted users");
        const data = await res.json();
        setAcceptedUserIds(data.data || []);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchAcceptedUsers();
  }, [planId]);

  const hasReviewed = currentUser
    ? reviews.some((r) => r.reviewer?.id === currentUser.id)
    : false;

  const userReview = currentUser
    ? reviews.find((r) => r.reviewer?.id === currentUser.id) ?? null
    : null;

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || "");
    } else {
      setRating(5);
      setComment("");
      setEditingReviewId(null);
    }
  }, [userReview]);

  const handleSubmitReview = async () => {
    if (!currentUser) return toast.error("Login to submit a review");
    setReviewLoading(true);
    try {
      const token = await getCookie("accessToken");
      const payload = {
        reviewedId: planOwnerId,
        travelPlanId: planId,
        rating,
        comment,
      };
      const url = editingReviewId
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/${editingReviewId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews`;
      const method = editingReviewId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      const newReview = (await res.json()).data;

      if (editingReviewId) {
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReviewId ? newReview : r))
        );
      } else {
        setReviews((prev) => [...prev, newReview]);
      }

      toast.success("Review submitted!");

 
      await fetchReviews();
      setIsEditModalOpen(false);
      setEditingReviewId(null);
      setActiveReviewId(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!currentUser) return toast.error("Login required");
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

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <FiStar /> Reviews
      </h2>

      {currentUser &&
        acceptedUserIds.includes(currentUser.id) &&
        currentUser.id !== planOwnerId &&
        !hasReviewed && (
          <div className="flex flex-col gap-2 border p-3 rounded-md dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <span
                    className={`text-2xl cursor-pointer ${
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
              rows={3}
              className="border p-2 rounded-md w-full dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleSubmitReview}
              disabled={reviewLoading}
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {editingReviewId ? "Update Review" : "Submit"}
            </button>
          </div>
        )}

      <ul className="space-y-2">
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <li
              key={r.id}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">
                    Name: {r.reviewer?.fullName}
                  </span>
                  <span className="font-semibold flex items-center gap-1">
                    Ratings:{" "}
                    {[...Array(r.rating)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </span>
                  <p className="font-semibold">Comment: {r.comment || "-"}</p>
                </div>

                {/* three dot edit delete */}

                {currentUser?.id === r.reviewer?.id && (
                  <div className="relative">
                    <BsThreeDotsVertical
                      className="cursor-pointer"
                      onClick={() =>
                        setActiveReviewId(activeReviewId === r.id ? null : r.id)
                      }
                    />
                    {activeReviewId === r.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border rounded shadow-md z-10">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => {
                            setEditingReviewId(r.id);
                            setRating(r.rating);
                            setIsEditModalOpen(true);
                            setComment(r.comment || "");
                            setActiveReviewId(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-red-600"
                          onClick={() => {
                            setDeleteReviewId(r.id);
                            setActiveReviewId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      <EditModal
        isOpen={editingReviewId !== null}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingReviewId(null);
        }}
        rating={rating}
        comment={comment}
        onChangeRating={setRating}
        onChangeComment={setComment}
        onSubmit={handleSubmitReview}
      />
      <DeleteModal
        isOpen={deleteReviewId !== null}
        onClose={() => setDeleteReviewId(null)}
        onDelete={() => {
          if (deleteReviewId) handleDeleteReview(deleteReviewId);
          setDeleteReviewId(null);
        }}
      />
    </div>
  );
}
