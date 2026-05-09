import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [location, setLocation] = useState(user?.location || '');
  const [editing, setEditing] = useState(false);

  if (!user) {
    navigate('/home');
    return null;
  }

  const handleSave = () => {
    updateProfile({ name, email, location });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={() => {}} />

      <div className="max-w-3xl mx-auto px-6 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-8">Profile</h1>

        {/* Profile Info - UC-03 */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center text-2xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E]">{name}</h2>
                <p className="text-sm text-[#9B96B0]">{email}</p>
                {user.isStudent && (
                  <span className="inline-block mt-1 py-1 px-2.5 rounded-lg bg-[#EEF2FF] text-[#6366F1] text-xs font-bold">
                    🎓 Student
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="py-2 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] bg-white text-xs font-bold text-[#4A4560] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] transition-all"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[#9B96B0]">Location: </span>
                <span className="font-medium">{location || 'Not set'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Preferences - UC-04 */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6 md:p-8 mb-6">
          <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Preferences</h3>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-[#9B96B0]">Dietary: </span>
              <span className="font-medium">{user.preferences?.dietary || 'No restriction'}</span>
            </div>
            <div>
              <span className="text-[#9B96B0]">Max Price: </span>
              <span className="font-medium">Rs.{user.preferences?.maxPrice || 1000}</span>
            </div>
            <div>
              <span className="text-[#9B96B0]">Cuisine: </span>
              <span className="font-medium">{user.preferences?.cuisine || 'Any'}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/home')}
            className="mt-4 py-2 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] bg-white text-xs font-bold text-[#4A4560] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
          >
            Edit Preferences
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6 md:p-8 mb-6">
          <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Quick Links</h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="py-3 px-4 rounded-xl bg-[#FFF0E8] text-sm font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all text-left"
            >
              📦 Order History
            </button>
            <button
              onClick={() => navigate('/budget')}
              className="py-3 px-4 rounded-xl bg-[#FFF0E8] text-sm font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all text-left"
            >
              💰 Budget Settings
            </button>
            <button
              onClick={() => navigate('/deals')}
              className="py-3 px-4 rounded-xl bg-[#FFF0E8] text-sm font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all text-left"
            >
              🎟️ My Vouchers
            </button>
            <button
              onClick={() => navigate('/group-order')}
              className="py-3 px-4 rounded-xl bg-[#FFF0E8] text-sm font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all text-left"
            >
              👥 Group Orders
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate('/home');
          }}
          className="w-full py-3 rounded-xl bg-red-500 border-none text-sm font-extrabold text-white hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
