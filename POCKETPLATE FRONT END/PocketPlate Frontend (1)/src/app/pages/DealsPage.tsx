import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import AuthModal from '../components/AuthModal';
import VouchersModal from '../components/VouchersModal';

export default function DealsPage() {
  const { vouchers } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showVouchersModal, setShowVouchersModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'student' | 'card'>('all');

  const filteredVouchers = vouchers.filter(v => {
    if (selectedTab === 'all') return true;
    return v.category === selectedTab;
  });

  const promos = [
    { id: 1, title: '30% off your order', code: 'POCKET30', badge: 'Flash Deal', emoji: '⚡', gradient: 'from-[#667eea] to-[#764ba2]' },
    { id: 2, title: 'Free delivery all week', code: 'Student special', badge: 'Student', emoji: '🎓', gradient: 'from-[#f093fb] to-[#f5576c]' },
    { id: 3, title: '15% off with HBL', code: 'Selected restaurants', badge: 'Card Deal', emoji: '💳', gradient: 'from-[#4facfe] to-[#00f2fe]' },
    { id: 4, title: 'Combo builder from Rs.600', code: 'Mix restaurants freely', badge: 'New!', emoji: '🍱', gradient: 'from-[#43e97b] to-[#38f9d7]' },
    { id: 5, title: 'Buy 1 Get 1 Free', code: 'Select items only', badge: 'Weekend', emoji: '🎉', gradient: 'from-[#FA709A] to-[#FEE140]' },
    { id: 6, title: '20% off on Biryani', code: 'Every Friday', badge: 'Weekly', emoji: '🍛', gradient: 'from-[#30cfd0] to-[#330867]' }
  ];

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />

      <div className="px-9 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-2">
          Deals & Offers
        </h1>
        <p className="text-[#9B96B0] mb-8">Save more with exclusive deals and promotions</p>

        {/* Daily Updates - UC-13 */}
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl p-6 md:p-8 mb-8 text-white">
          <h2 className="font-serif text-2xl font-semibold mb-2">📅 Daily Updates</h2>
          <p className="text-white/80 mb-4">Fresh deals updated every day</p>
          <div className="text-sm bg-white/20 rounded-xl p-4">
            <p className="font-bold mb-2">Today's Highlights:</p>
            <ul className="space-y-1">
              <li>• 30% off on all orders above Rs.1,500</li>
              <li>• Free delivery for students</li>
              <li>• HBL cardholders get 15% cashback</li>
            </ul>
          </div>
        </div>

        {/* Promotions - UC-14, UC-15 */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E] mb-5">Current Promotions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map(promo => (
              <div
                key={promo.id}
                className={`rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform bg-gradient-to-br ${promo.gradient}`}
              >
                <div className="inline-block bg-white/20 rounded-lg px-2.5 py-0.5 text-[10px] font-extrabold text-white tracking-wider uppercase mb-2">
                  {promo.badge}
                </div>
                <h4 className="font-serif text-xl font-semibold text-white mb-1 leading-tight">
                  {promo.title}
                </h4>
                <p className="text-sm text-white/80 font-semibold">{promo.code}</p>
                <div className="absolute bottom-2 right-2 text-6xl opacity-30">{promo.emoji}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vouchers - UC-16 */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E]">Available Vouchers</h2>
            <button
              onClick={() => setShowVouchersModal(true)}
              className="text-sm font-bold text-[#FF6B35] hover:underline"
            >
              View All
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setSelectedTab('all')}
              className={`py-2 px-4 rounded-3xl text-sm font-bold border-[1.5px] transition-all ${
                selectedTab === 'all'
                  ? 'bg-[#FFF0E8] border-[rgba(255,107,53,0.3)] text-[#FF6B35]'
                  : 'bg-white border-[#F0EBE3] text-[#4A4560]'
              }`}
            >
              All Vouchers
            </button>
            <button
              onClick={() => setSelectedTab('student')}
              className={`py-2 px-4 rounded-3xl text-sm font-bold border-[1.5px] transition-all ${
                selectedTab === 'student'
                  ? 'bg-[#EEF2FF] border-[rgba(99,102,241,0.3)] text-[#6366F1]'
                  : 'bg-white border-[#F0EBE3] text-[#4A4560]'
              }`}
            >
              🎓 Student
            </button>
            <button
              onClick={() => setSelectedTab('card')}
              className={`py-2 px-4 rounded-3xl text-sm font-bold border-[1.5px] transition-all ${
                selectedTab === 'card'
                  ? 'bg-[#FFF0E8] border-[rgba(255,107,53,0.3)] text-[#FF6B35]'
                  : 'bg-white border-[#F0EBE3] text-[#4A4560]'
              }`}
            >
              💳 Card Offers
            </button>
          </div>

          {/* Voucher Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVouchers.map(voucher => (
              <div
                key={voucher.id}
                className="bg-white border-[1.5px] border-dashed border-[rgba(255,107,53,0.4)] rounded-2xl p-5 hover:bg-[#FFF0E8] hover:-translate-y-0.5 transition-all cursor-pointer relative"
              >
                <div className={`absolute top-3 right-3 text-[9px] font-extrabold py-1 px-2 rounded-md ${
                  voucher.category === 'student' ? 'bg-[#EEF2FF] text-[#6366F1]' : 'bg-[#FFF0E8] text-[#FF6B35]'
                }`}>
                  {voucher.category?.toUpperCase()}
                </div>
                <div className="font-serif text-4xl font-semibold text-[#FF6B35] leading-none mb-2">
                  {voucher.type === 'percentage' ? `${voucher.discount}%` : `Rs.${voucher.discount}`}
                </div>
                <div className="text-sm font-bold text-[#1A1A2E] mb-1">{voucher.description}</div>
                <div className="text-xs text-[#9B96B0] font-semibold mb-3">{voucher.expiresIn}</div>
                <div className="text-xs font-bold text-[#06D6A0] bg-[#E8FFF5] rounded-lg px-2 py-1 inline-block">
                  Code: {voucher.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} onSwitchMode={(m) => setAuthMode(m)} />}
      {showVouchersModal && <VouchersModal onClose={() => setShowVouchersModal(false)} />}
    </div>
  );
}
