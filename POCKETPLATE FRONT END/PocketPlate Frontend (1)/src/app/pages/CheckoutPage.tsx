import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, cart, appliedVoucher, placeOrder } = useApp();
  const [selectedCard, setSelectedCard] = useState(user?.savedCards?.[0]?.id || '');
  const [processing, setProcessing] = useState(false);

  if (!user) {
    navigate('/home');
    return null;
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const discount = appliedVoucher
    ? appliedVoucher.type === 'percentage'
      ? Math.round(subtotal * (appliedVoucher.discount / 100))
      : appliedVoucher.discount
    : 0;
  const deliveryFee = 150;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      await placeOrder({
        total,
        paymentCard: selectedCard,
        voucher: appliedVoucher?.code
      });

      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (error) {
      console.error(error);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={() => {}} />

      <div className="max-w-3xl mx-auto px-6 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-8">Checkout</h1>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6 mb-6">
          <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Delivery Address</h3>
          <p className="text-sm text-[#4A4560] font-medium flex items-center gap-2">
            <span>📍</span>
            {user.location || 'No address set'}
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6 mb-6">
          <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Order Summary</h3>

          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div key={`${item.restaurantId}-${item.item.id}`} className="flex justify-between text-sm">
                <span className="text-[#9B96B0]">
                  {item.quantity}x {item.item.name} ({item.restaurantName})
                </span>
                <span className="font-semibold">Rs.{item.item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-[#F0EBE3]">
            <div className="flex justify-between text-sm">
              <span className="text-[#9B96B0]">Subtotal</span>
              <span className="font-semibold">Rs.{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#9B96B0]">Delivery Fee</span>
              <span className="font-semibold">Rs.{deliveryFee}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-[#06D6A0]">
                <span>Discount ({appliedVoucher?.code})</span>
                <span className="font-semibold">-Rs.{discount}</span>
              </div>
            )}
            <div className="border-t border-[#F0EBE3] pt-3 flex justify-between">
              <span className="font-bold text-[#1A1A2E]">Total</span>
              <span className="font-serif text-2xl font-semibold text-[#FF6B35]">Rs.{total}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6 mb-6">
          <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Payment Method</h3>

          <div className="space-y-3">
            {user.savedCards && user.savedCards.length > 0 ? (
              user.savedCards.map(card => (
                <label
                  key={card.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-[1.5px] cursor-pointer transition-all ${
                    selectedCard === card.id
                      ? 'border-[#FF6B35] bg-[#FFF0E8]'
                      : 'border-[#F0EBE3] hover:border-[#FF6B35]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={card.id}
                    checked={selectedCard === card.id}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    className="w-4 h-4 text-[#FF6B35]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm">{card.brand} •••• {card.last4}</div>
                    <div className="text-xs text-[#9B96B0]">Expires {card.expiry}</div>
                  </div>
                  <span className="text-2xl">💳</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-[#9B96B0]">No saved cards. Add a card to continue.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 py-3 rounded-xl bg-[#FFF0E8] border-none text-sm font-extrabold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all"
          >
            Back to Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={processing || !selectedCard}
            className="flex-1 py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(255,107,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Place Order • Rs.${total}`}
          </button>
        </div>
      </div>
    </div>
  );
}
