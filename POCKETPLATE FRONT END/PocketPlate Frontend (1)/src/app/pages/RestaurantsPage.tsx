import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import AuthModal from '../components/AuthModal';

export default function RestaurantsPage() {
  const navigate = useNavigate();
  const { restaurants, addToCart } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [filterNew, setFilterNew] = useState(false);
  const [filterBudget, setFilterBudget] = useState(false);

  const filteredRestaurants = restaurants.filter(r => {
    if (filterNew && !r.isNew) return false;
    if (filterBudget && !r.isBudgetFriendly) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />

      <div className="px-9 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-6">
          All Restaurants
        </h1>

        {/* Filters */}
        <div className="flex gap-2.5 mb-6 flex-wrap">
          <button
            onClick={() => setFilterNew(!filterNew)}
            className={`py-2 px-4 rounded-3xl text-[13px] font-bold border-[1.5px] transition-all ${
              filterNew
                ? 'bg-[#E8FFF5] border-[rgba(6,214,160,0.3)] text-[#06D6A0]'
                : 'bg-white border-[#F0EBE3] text-[#4A4560] hover:bg-[#E8FFF5]'
            }`}
          >
            🆕 Newly Opened
          </button>
          <button
            onClick={() => setFilterBudget(!filterBudget)}
            className={`py-2 px-4 rounded-3xl text-[13px] font-bold border-[1.5px] transition-all ${
              filterBudget
                ? 'bg-[#E8FFF5] border-[rgba(6,214,160,0.3)] text-[#06D6A0]'
                : 'bg-white border-[#F0EBE3] text-[#4A4560] hover:bg-[#E8FFF5]'
            }`}
          >
            💰 Budget Friendly
          </button>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRestaurants.map(restaurant => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.09)]"
            >
              <div className="h-40 flex items-center justify-center text-6xl relative bg-gradient-to-br from-orange-50 to-orange-100">
                {restaurant.emoji}
                {restaurant.isNew && (
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold py-1 px-2.5 rounded-lg bg-[#E8FFF5] text-[#06D6A0] border border-[#06D6A0]">
                    New
                  </span>
                )}
                {restaurant.hasDeal && (
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold py-1 px-2.5 rounded-lg bg-[#FFF0E8] text-[#FF6B35] border border-[#FF6B35]">
                    Deal
                  </span>
                )}
                {restaurant.isBudgetFriendly && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-extrabold py-1 px-2.5 rounded-lg bg-[#E8FFF5] text-[#06D6A0] border border-[#06D6A0]">
                    ✓ Budget
                  </span>
                )}
              </div>
              <div className="p-4">
                <h4 className="text-base font-extrabold text-[#1A1A2E] mb-1.5">{restaurant.name}</h4>
                <div className="flex items-center gap-2 text-xs text-[#9B96B0] font-semibold mb-3">
                  <span className="text-[#FFB020]">★</span>
                  {restaurant.rating} · {restaurant.deliveryTime} · {restaurant.cuisine}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#06D6A0]">From Rs.{restaurant.priceFrom}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (restaurant.menu[0]) {
                        addToCart(restaurant.id, restaurant.name, restaurant.menu[0]);
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-[#FFF0E8] border-none text-lg text-[#FF6B35] font-extrabold flex items-center justify-center hover:bg-[#FF6B35] hover:text-white hover:scale-110 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl font-semibold text-[#1A1A2E] mb-2">No restaurants found</h3>
            <p className="text-[#9B96B0]">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitchMode={(m) => setAuthMode(m)} />}
    </div>
  );
}
