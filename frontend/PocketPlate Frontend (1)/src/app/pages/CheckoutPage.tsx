import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import AuthModal from '../components/AuthModal';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, cart, appliedVoucher, placeOrder, addPaymentCard } = useApp();
  const [selectedCard, setSelectedCard] = useState(user?.savedCards?.[0]?.id || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardError, setCardError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (!selectedCard && user?.savedCards?.length) {
      setSelectedCard(user.savedCards[0].id);
    }
  }, [selectedCard, user?.savedCards]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FEFAF5]">
        <Navigation
          onAuthClick={(mode) => {
            setAuthMode(mode);
            setShowAuthModal(true);
          }}
        />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="font-serif text-3xl font-semibold text-[#1A1A2E] mb-3">Log in to checkout</h1>
          <p className="text-sm font-medium text-[#9B96B0] mb-6">You need an account before placing an order.</p>
          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            className="py-3 px-6 rounded-xl bg-[#FF6B35] border-none text-sm font-bold text-white hover:bg-[#FF8C5A] transition-all"
          >
            Log in
          </button>
        </div>
        {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitchMode={(mode) => setAuthMode(mode)} />}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FEFAF5]">
        <Navigation onAuthClick={() => {}} />
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8FFF5] text-2xl font-extrabold text-[#06D6A0]">
              OK
            </div>
            <h1 className="font-serif text-3xl font-semibold text-[#1A1A2E] mb-3">Order placed</h1>
            <p className="text-sm font-medium text-[#9B96B0] mb-2">Your food is being confirmed with the restaurant.</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-6">Order #{orderRef}</p>
            <button
              onClick={() => navigate('/orders')}
              className="py-3 px-6 rounded-xl bg-[#FF6B35] border-none text-sm font-bold text-white hover:bg-[#FF8C5A] transition-all"
            >
              View order
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEFAF5]">
        <Navigation onAuthClick={() => {}} />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="font-serif text-3xl font-semibold text-[#1A1A2E] mb-3">Your cart is empty</h1>
          <p className="text-sm font-medium text-[#9B96B0] mb-6">Add something tasty before checkout.</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="py-3 px-6 rounded-xl bg-[#FF6B35] border-none text-sm font-bold text-white hover:bg-[#FF8C5A] transition-all"
          >
            Browse restaurants
          </button>
        </div>
      </div>
    );
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
      const nextOrderRef = Math.random().toString(36).slice(2, 10).toUpperCase();
      await placeOrder({
        total,
        paymentCard: selectedCard,
        voucher: appliedVoucher?.code,
        orderRef: nextOrderRef
      });
      setOrderRef(nextOrderRef);
      setSubmitted(true);

      setTimeout(() => {
        navigate('/orders');
      }, 2500);
    } catch (error) {
      console.error(error);
      setProcessing(false);
    }
  };

  const detectCardBrand = (number: string) => {
    if (number.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'Amex';
    return 'Card';
  };

  const handleAddCard = () => {
    const digits = cardNumber.replace(/\D/g, '');
    const expiry = cardExpiry.trim();

    if (digits.length < 12 || !/^\d{2}\/\d{2}$/.test(expiry)) {
      setCardError('Enter a valid card number and expiry in MM/YY format.');
      return;
    }

    const newCard = addPaymentCard({
      brand: detectCardBrand(digits),
      last4: digits.slice(-4),
      expiry
    });

    if (newCard) {
      setSelectedCard(newCard.id);
      setCardNumber('');
      setCardExpiry('');
      setCardError('');
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
              <p className="text-sm text-[#9B96B0]">No saved cards yet. Add one below to continue.</p>
            )}
          </div>

          <div className="mt-5 pt-5 border-t border-[#F0EBE3]">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#9B96B0] mb-3">Add Card</h4>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card number"
                className="py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold outline-none focus:border-[#FF6B35]"
              />
              <input
                type="text"
                inputMode="numeric"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold outline-none focus:border-[#FF6B35]"
              />
              <button
                type="button"
                onClick={handleAddCard}
                className="py-3 px-5 rounded-xl bg-[#FFF0E8] border-none text-sm font-extrabold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all"
              >
                Add
              </button>
            </div>
            {cardError && <p className="text-xs font-semibold text-red-500 mt-2">{cardError}</p>}
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
