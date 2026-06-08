import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LocationModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useApp();
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = () => {
    updateProfile({ location });
    setTimeout(() => onClose(), 300);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm z-[1001] flex items-center justify-center p-6">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md">
        <div className="h-32 rounded-t-3xl bg-gradient-to-br from-[#f093fb] to-[#f5576c] flex items-center justify-center text-5xl">
          📍
        </div>

        <div className="p-5 md:p-6">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#1A1A2E] mb-1.5">Set your location</h3>
          <p className="text-[13px] text-[#9B96B0] font-medium mb-5">
            We'll show you the nearest restaurants.
          </p>

          <div className="mb-5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">
              Delivery address
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Gulberg, Lahore"
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-gradient-to-br from-[#f093fb] to-[#f5576c] border-none text-sm font-extrabold text-white hover:opacity-90 transition-all"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
