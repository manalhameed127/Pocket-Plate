import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import AuthModal from '../components/AuthModal';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user, orders } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FEFAF5]">
        <Navigation onAuthClick={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E] mb-2">Please log in</h2>
          <p className="text-[#9B96B0] mb-6">You need to log in to view your orders</p>
          <button
            onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
            className="py-3 px-6 rounded-xl bg-[#FF6B35] border-none text-sm font-bold text-white hover:bg-[#FF8C5A] transition-all"
          >
            Log In
          </button>
        </div>
        {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitchMode={(m) => setAuthMode(m)} />}
      </div>
    );
  }

  const handleSubmitReview = () => {
    console.log('Review submitted:', { orderId: selectedOrder?.id, rating, review });
    setShowReviewModal(false);
    setRating(5);
    setReview('');
  };

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />

      <div className="max-w-4xl mx-auto px-6 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E] mb-3">No orders yet</h2>
            <p className="text-[#9B96B0] mb-6">Start ordering from your favorite restaurants!</p>
            <button
              onClick={() => navigate('/restaurants')}
              className="py-3 px-8 rounded-xl bg-[#FF6B35] border-none text-sm font-bold text-white hover:bg-[#FF8C5A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#1A1A2E] mb-1">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-[#9B96B0]">
                      {new Date(order.date).toLocaleDateString('en-PK', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className="py-1.5 px-3.5 rounded-xl bg-[#E8FFF5] text-[#06D6A0] text-xs font-bold">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#4A4560]">
                        {item.quantity}x {item.item.name}
                      </span>
                      <span className="font-semibold">Rs.{item.item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F0EBE3]">
                  <div>
                    <span className="text-sm text-[#9B96B0]">Total: </span>
                    <span className="font-serif text-xl font-semibold text-[#FF6B35]">Rs.{order.total}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowReviewModal(true);
                    }}
                    className="py-2 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] bg-white text-xs font-bold text-[#4A4560] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
                  >
                    Add Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal - UC-06 */}
      {showReviewModal && (
        <div onClick={() => setShowReviewModal(false)} className="fixed inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm z-[1001] flex items-center justify-center p-6">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md">
            <div className="h-32 rounded-t-3xl bg-gradient-to-br from-[#FFD166] to-[#FF6B35] flex items-center justify-center text-5xl">
              ⭐
            </div>

            <div className="p-6">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Add Review</h3>

              <div className="mb-4">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-all ${star <= rating ? 'text-[#FFB020]' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-medium text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35] resize-none"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                className="w-full py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] transition-all"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitchMode={(m) => setAuthMode(m)} />}
    </div>
  );
}
