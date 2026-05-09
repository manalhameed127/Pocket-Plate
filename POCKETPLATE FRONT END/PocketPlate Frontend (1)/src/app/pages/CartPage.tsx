import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import AuthModal from '../components/AuthModal';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, appliedVoucher, applyVoucher, vouchers } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showVoucherSelector, setShowVoucherSelector] = useState(false);

  // Group cart items by restaurant
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantName: item.restaurantName,
        items: []
      };
    }
    acc[item.restaurantId].items.push(item);
    return acc;
  }, {} as Record<string, { restaurantName: string; items: typeof cart }>);

  const subtotal = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const discount = appliedVoucher
    ? appliedVoucher.type === 'percentage'
      ? Math.round(subtotal * (appliedVoucher.discount / 100))
      : appliedVoucher.discount
    : 0;
  const deliveryFee = 150;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEFAF5]">
        <Navigation onAuthClick={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="font-serif text-3xl font-semibold text-[#1A1A2E] mb-3">Your cart is empty</h2>
          <p className="text-[#9B96B0] mb-6">Add some delicious meals to get started!</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="py-3 px-8 rounded-xl bg-[#FF6B35] border-none text-sm font-bold text-white hover:bg-[#FF8C5A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
          >
            Browse Restaurants
          </button>
        </div>
        {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitchMode={(m) => setAuthMode(m)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />

      <div className="max-w-5xl mx-auto px-6 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedCart).map(([restaurantId, group]) => (
              <div key={restaurantId} className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
                <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">{group.restaurantName}</h3>

                <div className="space-y-3">
                  {group.items.map(cartItem => (
                    <div key={cartItem.item.id} className="flex items-center gap-4 py-3 border-t border-[#F0EBE3]">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-[#1A1A2E] mb-1">{cartItem.item.name}</h4>
                        <p className="text-xs text-[#9B96B0]">Rs.{cartItem.item.price} each</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#FFF0E8] rounded-lg p-1">
                          <button
                            onClick={() => updateCartQuantity(restaurantId, cartItem.item.id, cartItem.quantity - 1)}
                            className="w-7 h-7 rounded-md bg-white text-[#FF6B35] font-bold hover:bg-[#FF6B35] hover:text-white transition-all"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(restaurantId, cartItem.item.id, cartItem.quantity + 1)}
                            className="w-7 h-7 rounded-md bg-white text-[#FF6B35] font-bold hover:bg-[#FF6B35] hover:text-white transition-all"
                          >
                            +
                          </button>
                        </div>

                        <div className="w-20 text-right font-serif text-sm font-semibold">
                          Rs.{cartItem.item.price * cartItem.quantity}
                        </div>

                        <button
                          onClick={() => removeFromCart(restaurantId, cartItem.item.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6 sticky top-24">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
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
                  <span className="font-serif text-xl font-semibold text-[#FF6B35]">Rs.{total}</span>
                </div>
              </div>

              {/* Voucher Section */}
              <div className="mb-4">
                <button
                  onClick={() => setShowVoucherSelector(!showVoucherSelector)}
                  className="w-full py-2.5 px-4 rounded-xl border-[1.5px] border-dashed border-[rgba(255,107,53,0.4)] bg-[#FFF0E8] text-sm font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all"
                >
                  {appliedVoucher ? `✓ ${appliedVoucher.code} applied` : '🎟️ Apply Voucher'}
                </button>

                {showVoucherSelector && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {vouchers.map(voucher => (
                      <button
                        key={voucher.id}
                        onClick={() => {
                          applyVoucher(voucher);
                          setShowVoucherSelector(false);
                        }}
                        className="w-full text-left py-2 px-3 rounded-lg border border-[#F0EBE3] hover:bg-[#FFF0E8] transition-all"
                      >
                        <div className="font-bold text-sm text-[#FF6B35]">{voucher.code}</div>
                        <div className="text-xs text-[#9B96B0]">
                          {voucher.type === 'percentage' ? `${voucher.discount}% off` : `Rs.${voucher.discount} off`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal mode={authModal} onClose={() => setShowAuthModal(false)} onSwitchMode={(m) => setAuthMode(m)} />}
    </div>
  );
}
