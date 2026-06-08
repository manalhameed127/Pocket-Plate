import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import Navigation from "../components/Navigation";

export default function ComboPage() {
  const navigate = useNavigate();
  const { restaurants, cart, addToCart } = useApp();
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    restaurants[0],
  );

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={() => {}} />

      <div className="max-w-4xl mx-auto px-6 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-2">
          Cross-Restaurant Combo
        </h1>
        <p className="text-[#9B96B0] mb-8">
          Mix and match items from different restaurants
        </p>

        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
          {/* Restaurant Selector */}
          <div className="mb-6">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-3">
              Select Restaurant
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {restaurants.slice(0, 6).map((rest) => (
                <button
                  key={rest.id}
                  onClick={() => setSelectedRestaurant(rest)}
                  className={`py-3 px-4 rounded-xl border-[1.5px] transition-all text-left ${
                    selectedRestaurant.id === rest.id
                      ? "border-[#FF6B35] bg-[#FFF0E8]"
                      : "border-[#F0EBE3] hover:border-[#FF6B35]"
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {rest.emoji}
                  </div>
                  <div className="text-xs font-bold text-[#1A1A2E]">
                    {rest.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#9B96B0] mb-3">
              {selectedRestaurant.name} Menu
            </h4>
            <div className="space-y-2">
              {selectedRestaurant.menu.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 px-4 rounded-xl border border-[#F0EBE3] hover:bg-[#FFF0E8] transition-all"
                >
                  <div>
                    <div className="text-sm font-bold text-[#1A1A2E]">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#9B96B0]">
                      {item.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-sm font-semibold">
                      Rs.{item.price}
                    </span>
                    <button
                      onClick={() =>
                        addToCart(
                          selectedRestaurant.id,
                          selectedRestaurant.name,
                          item,
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-[#FF6B35] text-white font-bold hover:bg-[#FF8C5A] hover:scale-110 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] transition-all"
            >
              View Cart ({cart.length})
            </button>
            <button
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
              className="flex-1 py-3 rounded-xl bg-[#06D6A0] border-none text-sm font-extrabold text-white hover:bg-[#05c090] transition-all disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}