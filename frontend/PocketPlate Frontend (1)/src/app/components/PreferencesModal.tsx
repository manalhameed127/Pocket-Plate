import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PreferencesModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile, restaurants, addToCart } = useApp();
  const [dietary, setDietary] = useState(user?.preferences?.dietary || 'No restriction');
  const [maxPrice, setMaxPrice] = useState(user?.preferences?.maxPrice?.toString() || '1000');
  const [cuisine, setCuisine] = useState(user?.preferences?.cuisine || 'Any');
  const [showPicks, setShowPicks] = useState(false);

  const budget = Number.parseInt(maxPrice, 10) || 1000;
  const picks = restaurants
    .flatMap((restaurant) =>
      restaurant.menu.map((item) => ({
        restaurant,
        item,
        score:
          (item.price <= budget ? 2 : 0) +
          (cuisine === 'Any' || restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase()) ? 2 : 0) +
          (dietary === 'No restriction' || item.description.toLowerCase().includes(dietary.toLowerCase()) ? 1 : 0) +
          (restaurant.isBudgetFriendly ? 1 : 0),
      })),
    )
    .filter((pick) => pick.item.price <= budget)
    .sort((a, b) => b.score - a.score || a.item.price - b.item.price)
    .slice(0, 5);

  const handleSave = () => {
    updateProfile({
      preferences: {
        dietary,
        maxPrice: budget,
        cuisine,
      },
    });
    setShowPicks(true);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm z-[1001] flex items-center justify-center p-6">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="h-32 rounded-t-3xl bg-gradient-to-br from-[#0F0F23] to-[#1A1A3E] flex items-center justify-center text-5xl">
          AI
        </div>

        <div className="p-5 md:p-6">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#1A1A2E] mb-1.5">AI Preferences</h3>
          <p className="text-[13px] text-[#9B96B0] font-medium mb-5">
            Tell us your tastes and we'll find the perfect meals.
          </p>

          <div className="mb-3">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">
              Dietary preference
            </label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            >
              <option>No restriction</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Halal</option>
              <option>Gluten-free</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">
              Max meal price (PKR)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">
              Favourite cuisine
            </label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            >
              <option>Any</option>
              <option>Pakistani</option>
              <option>Chinese</option>
              <option>Italian</option>
              <option>Indian</option>
              <option>Continental</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] border-none text-sm font-extrabold text-white hover:opacity-90 transition-all"
          >
            Save & Get Picks
          </button>

          {showPicks && (
            <div className="mt-5 border-t border-[#F0EBE3] pt-5">
              <h4 className="font-serif text-lg font-semibold text-[#1A1A2E] mb-3">AI Picks</h4>

              {picks.length > 0 ? (
                <div className="space-y-3">
                  {picks.map(({ restaurant, item }) => (
                    <div key={`${restaurant.id}-${item.id}`} className="rounded-2xl border border-[#F0EBE3] bg-[#FEFAF5] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-extrabold text-[#1A1A2E]">{item.name}</div>
                          <div className="text-xs font-semibold text-[#9B96B0]">{restaurant.name}</div>
                          <div className="mt-1 text-xs text-[#4A4560]">{item.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-serif text-lg font-semibold text-[#FF6B35]">Rs.{item.price}</div>
                          <button
                            onClick={() => addToCart(restaurant.id, restaurant.name, item)}
                            className="mt-2 rounded-xl bg-[#FF6B35] px-3 py-2 text-xs font-extrabold text-white hover:bg-[#FF8C5A] transition-all"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#F0EBE3] bg-[#FEFAF5] p-4 text-sm font-medium text-[#4A4560]">
                  No meals match this max price yet. Raise the price a little and try again.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
