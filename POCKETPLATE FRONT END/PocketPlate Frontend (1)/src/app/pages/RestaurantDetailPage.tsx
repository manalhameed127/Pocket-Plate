import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import Navigation from "../components/Navigation";
import AuthModal from "../components/AuthModal";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, addToCart, user } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">(
    "login",
  );
  const [reviews, setReviews] = useState([
    {
      name: "Ahmed K.",
      rating: 5,
      comment: "Amazing food, delivered hot and fresh!",
      date: "2 days ago",
    },
    {
      name: "Sara M.",
      rating: 4,
      comment:
        "Great taste, slightly late delivery but worth it.",
      date: "1 week ago",
    },
    {
      name: "Ali R.",
      rating: 5,
      comment: "Best biryani in Lahore, will order again!",
      date: "2 weeks ago",
    },
  ]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const restaurant = restaurants.find((r) => r.id === id);

  const handleSubmitReview = () => {
    if (!newRating || !newComment.trim()) return;
    setReviews([
      {
        name: user ? user.name : "Anonymous",
        rating: newRating,
        comment: newComment.trim(),
        date: "Just now",
      },
      ...reviews,
    ]);
    setNewRating(0);
    setNewComment("");
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FEFAF5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E] mb-2">
            Restaurant not found
          </h2>
          <button
            onClick={() => navigate("/restaurants")}
            className="text-[#FF6B35] font-bold"
          >
            Back to restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-9">
        {/* Restaurant Header */}
        <div className="bg-white rounded-3xl border border-[#F0EBE3] overflow-hidden mb-6">
          <div className="h-48 md:h-64 flex items-center justify-center text-[120px] relative bg-gradient-to-br from-orange-50 to-orange-100">
            {restaurant.emoji}
            {restaurant.isBudgetFriendly && (
              <span className="absolute top-4 right-4 text-xs font-extrabold py-2 px-4 rounded-xl bg-[#E8FFF5] text-[#06D6A0] border-2 border-[#06D6A0]">
                ✓ Budget Friendly
              </span>
            )}
          </div>

          <div className="p-6 md:p-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-3">
              {restaurant.name}
            </h1>
            <p className="text-base text-[#9B96B0] font-medium mb-4">
              {restaurant.cuisine}
            </p>

            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#FFF0E8] text-[#FF6B35]">
                <span className="text-[#FFB020]">★</span>
                <span className="text-sm font-bold">
                  {restaurant.rating}
                </span>
              </div>
              <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#FFF0E8] text-[#FF6B35]">
                <span>🕐</span>
                <span className="text-sm font-bold">
                  {restaurant.deliveryTime}
                </span>
              </div>
              <div className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#FFF0E8] text-[#FF6B35]">
                <span className="text-sm font-bold">
                  From Rs.{restaurant.priceFrom}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-3xl border border-[#F0EBE3] p-6 md:p-8">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#9B96B0] mb-4">
            Popular Items
          </h2>

          <div className="space-y-3">
            {restaurant.menu.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-t border-[#F0EBE3] gap-4"
              >
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-[#1A1A2E] mb-1">
                    {item.name}
                  </h5>
                  <p className="text-xs text-[#9B96B0] font-medium">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-serif text-base font-semibold text-[#1A1A2E]">
                    Rs.{item.price}
                  </span>
                  <button
                    onClick={() =>
                      addToCart(
                        restaurant.id,
                        restaurant.name,
                        item,
                      )
                    }
                    className="py-1.5 px-3.5 rounded-lg bg-[#FF6B35] border-none text-[11px] font-extrabold text-white hover:bg-[#FF8C5A] hover:scale-105 transition-all whitespace-nowrap"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl bg-[#FFF0E8] border-none text-sm font-extrabold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
            >
              View Full Menu →
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl border border-[#F0EBE3] p-6 md:p-8 mt-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#9B96B0] mb-6">
            Customer Reviews
          </h2>

          {/* Existing Reviews */}
          <div className="space-y-4 mb-8">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#FEFAF5] border border-[#F0EBE3]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white font-bold text-sm flex items-center justify-center">
                      {review.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-[#1A1A2E]">
                      {review.name}
                    </span>
                  </div>
                  <span className="text-xs text-[#9B96B0]">
                    {review.date}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${star <= review.rating ? "text-[#FFB020]" : "text-gray-200"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#4A4560]">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Write a Review */}
          <div className="border-t border-[#F0EBE3] pt-6">
            <h3 className="font-serif text-lg font-semibold text-[#1A1A2E] mb-4">
              Write a Review
            </h3>

            {!user ? (
              <div className="p-4 rounded-2xl bg-[#FFF0E8] border border-[#FF6B35] text-center">
                <p className="text-sm font-bold text-[#FF6B35] mb-3">
                  You need to be logged in to write a review
                </p>
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="py-2 px-6 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] transition-all"
                >
                  Log in to Review
                </button>
              </div>
            ) : (
              <>
                {/* Star Rating */}
                <div className="mb-4">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() =>
                          setHoveredStar(star)
                        }
                        onMouseLeave={() => setHoveredStar(0)}
                        className="text-3xl transition-all hover:scale-110"
                      >
                        <span
                          className={
                            star <= (hoveredStar || newRating)
                              ? "text-[#FFB020]"
                              : "text-gray-200"
                          }
                        >
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                    Your Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) =>
                      setNewComment(e.target.value)
                    }
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-medium outline-none focus:border-[#FF6B35] resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={!newRating || !newComment.trim()}
                  className="w-full py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] transition-all disabled:opacity-50"
                >
                  Submit Review
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}
    </div>
  );
}