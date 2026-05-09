import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PreferencesModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useApp();
  const [dietary, setDietary] = useState(user?.preferences?.dietary || 'No restriction');
  const [maxPrice, setMaxPrice] = useState(user?.preferences?.maxPrice?.toString() || '1000');
  const [cuisine, setCuisine] = useState(user?.preferences?.cuisine || 'Any');

  const handleSave = () => {
    updateProfile({
      preferences: {
        dietary,
        maxPrice: parseInt(maxPrice),
        cuisine
      }
    });
    setTimeout(() => onClose(), 300);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm z-[1001] flex items-center justify-center p-6">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="h-32 rounded-t-3xl bg-gradient-to-br from-[#0F0F23] to-[#1A1A3E] flex items-center justify-center text-5xl">
          ✨
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
            Save & Get Picks →
          </button>
        </div>
      </div>
    </div>
  );
}
