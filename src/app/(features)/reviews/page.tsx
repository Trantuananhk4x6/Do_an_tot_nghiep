"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { FloatingDots } from "@/components/ui/floating-dots";
import { AnimatedStars } from "@/components/ui/animated-stars";

interface Rating {
  id: number;
  userEmail: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const { user, isSignedIn } = useUser();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadRatings();
  }, []);

  useEffect(() => {
    if (user && allRatings.length > 0) {
      const userRating = allRatings.find(
        (r) => r.userEmail === user.primaryEmailAddress?.emailAddress
      );
      if (userRating) {
        setHasUserRated(true);
        setSelectedRating(userRating.rating);
        setComment(userRating.comment || "");
      }
    }
  }, [user, allRatings]);

  const loadRatings = async () => {
    setIsLoadingRatings(true);
    try {
      const response = await fetch("/api/ratings");
      if (response.ok) {
        const data = await response.json();
        setAllRatings(data.ratings);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setIsLoadingRatings(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || selectedRating === 0) {
      setSubmitMessage({ type: 'error', text: 'Please select a rating!' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      console.log("Submitting rating:", {
        userEmail: user.primaryEmailAddress?.emailAddress,
        userName: user.fullName || user.firstName || "Anonymous",
        rating: selectedRating,
        comment: comment.trim() || null,
      });

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

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: hasUserRated ? 'Review updated successfully! 🎉' : 'Thank you for your review! 🎉' });
        await loadRatings();
        setHasUserRated(true);
        // Scroll to reviews section
        setTimeout(() => {
          document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Failed to submit review. Please try again.' });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setSubmitMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRatings = filterRating
    ? allRatings.filter((r) => r.rating === filterRating)
    : allRatings;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = allRatings.filter((r) => r.rating === star).length;
    const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <>
      <FloatingDots />
      <AnimatedStars />
      <Header />
      
      <main className="min-h-screen relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reviews & Ratings
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Share your experience and help others succeed!</p>
          </div>

          {/* Statistics Section */}
          <div className="glass-effect border border-white/10 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-600 text-gray-600"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-400">Based on {totalRatings} reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                <div className="space-y-2">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <button
                        onClick={() => setFilterRating(filterRating === star ? null : star)}
                        className={`flex items-center gap-1 min-w-[80px] transition-colors ${
                          filterRating === star ? "text-yellow-400" : "text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        <span className="font-medium">{star}</span>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      <div className="flex-1 h-3 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 min-w-[60px] text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rate Us Section */}
            <div className="lg:col-span-1">
              <div className="glass-effect border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold gradient-text mb-6">
                  {hasUserRated ? "Your Review" : "Share Your Experience"}
                </h2>

                {!isSignedIn ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">Please sign in to leave a review</p>
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-6 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300">
                      Sign In
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-300 mb-4">Rate your experience</p>
                      
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
                              className={`w-10 h-10 ${
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
                        Share your thoughts
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience with AI Interview..."
                        className="w-full px-4 py-3 glass-effect border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none custom-scrollbar"
                        rows={6}
                      />
                    </div>

                    {/* Success/Error Message */}
                    {submitMessage && (
                      <div
                        className={`p-4 rounded-xl border ${
                          submitMessage.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        } animate-fade-in-up`}
                      >
                        <div className="flex items-center gap-2">
                          {submitMessage.type === 'success' ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="font-medium">{submitMessage.text}</span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={selectedRating === 0 || isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isSubmitting ? "Submitting..." : hasUserRated ? "Update Review" : "Submit Review"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* All Reviews Section */}
            <div className="lg:col-span-2" id="reviews-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-200">
                  All Reviews {filterRating && `(${filterRating} ⭐)`}
                </h2>
                {filterRating && (
                  <button
                    onClick={() => setFilterRating(null)}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {isLoadingRatings ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading reviews...</p>
                </div>
              ) : filteredRatings.length === 0 ? (
                <div className="glass-effect border border-white/10 rounded-2xl p-12 text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-400 text-lg">
                    {filterRating ? `No ${filterRating}-star reviews yet` : "No reviews yet. Be the first to share!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="glass-effect border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* User Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-neon">
                            {rating.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-200 text-lg">{rating.userName}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
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
                        <div className="glass-effect border border-white/5 rounded-xl p-4 mt-3">
                          <p className="text-gray-300 leading-relaxed">{rating.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
