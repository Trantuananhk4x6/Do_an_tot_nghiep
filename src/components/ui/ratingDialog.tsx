"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Rating {
  id: number;
  userEmail: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRatingSubmit: () => void;
}

const RatingDialog: React.FC<RatingDialogProps> = ({ isOpen, onClose, onRatingSubmit }) => {
  const { user } = useUser();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [activeTab, setActiveTab] = useState<"rate" | "view">("rate");

  useEffect(() => {
    if (isOpen && activeTab === "view") {
      loadRatings();
    }
  }, [isOpen, activeTab]);

  const loadRatings = async () => {
    setIsLoadingRatings(true);
    try {
      const response = await fetch("/api/ratings");
      if (response.ok) {
        const data = await response.json();
        setAllRatings(data.ratings);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setIsLoadingRatings(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || selectedRating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.primaryEmailAddress?.emailAddress,
          userName: user.fullName || user.firstName || "Anonymous",
          rating: selectedRating,
          comment: comment.trim() || null,
        }),
      });

      if (response.ok) {
        setSelectedRating(0);
        setComment("");
        onRatingSubmit();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-effect border border-white/10 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Rate AI Interview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("rate")}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === "rate"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Rate Us
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === "view"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            All Ratings ({allRatings.length})
          </button>
        </div>

        {/* Rate Tab */}
        {activeTab === "rate" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 mb-4">How would you rate your experience?</p>
              
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || selectedRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-600 text-gray-600"
                      } transition-colors`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              {selectedRating > 0 && (
                <p className="text-sm text-gray-400 mb-4">
                  You rated: {selectedRating} star{selectedRating > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full px-4 py-3 glass-effect border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={selectedRating === 0 || isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        )}

        {/* View Ratings Tab */}
        {activeTab === "view" && (
          <div className="space-y-4">
            {isLoadingRatings ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading ratings...</p>
              </div>
            ) : allRatings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No ratings yet. Be the first to rate!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allRatings.map((rating) => (
                  <div
                    key={rating.id}
                    className="glass-effect border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-200">{rating.userName}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-600 text-gray-600"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-400 text-sm mt-2">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingDialog;
