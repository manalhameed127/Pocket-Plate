import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';

export default function BudgetPage() {
  const navigate = useNavigate();
  const { user, budget, setBudget } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(budget?.amount?.toString() || '5000');
  const [newPeriod, setNewPeriod] = useState<'monthly' | 'weekly' | 'daily'>(budget?.period || 'monthly');

  if (!user) {
    navigate('/home');
    return null;
  }

  const handleSave = () => {
    setBudget({ amount: parseInt(newAmount), period: newPeriod });
    setIsEditing(false);
  };

  const spent = 3250; // Mock data - would come from orders in real app
  const remaining = budget ? budget.amount - spent : 0;
  const percentageUsed = budget ? Math.round((spent / budget.amount) * 100) : 0;

  // Calculate daily/weekly breakdown
  const getDailyAllowance = () => {
    if (!budget) return 0;
    if (budget.period === 'daily') return budget.amount;
    if (budget.period === 'weekly') return Math.round(budget.amount / 7);
    return Math.round(budget.amount / 30);
  };

  const getWeeklyAllowance = () => {
    if (!budget) return 0;
    if (budget.period === 'weekly') return budget.amount;
    if (budget.period === 'daily') return budget.amount * 7;
    return Math.round(budget.amount / 4);
  };

  // Mock spending history
  const spendingHistory = [
    { date: '2026-04-24', amount: 850, restaurant: 'Karachi Biryani House' },
    { date: '2026-04-22', amount: 650, restaurant: 'Student Biryani' },
    { date: '2026-04-20', amount: 1200, restaurant: 'Bundu Khan' },
    { date: '2026-04-18', amount: 550, restaurant: 'Subway Pakistan' }
  ];

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={() => {}} />

      <div className="max-w-5xl mx-auto px-6 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-2">
          Budget Management
        </h1>
        <p className="text-[#9B96B0] mb-8">Track and manage your food spending</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Overview - UC-07, UC-08 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Budget Card */}
            <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl p-6 md:p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-white/80 text-sm font-bold mb-2">
                    {budget?.period.toUpperCase()} BUDGET
                  </h2>
                  <div className="font-serif text-4xl md:text-5xl font-semibold">
                    Rs.{budget?.amount.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="py-2 px-4 rounded-xl bg-white/20 backdrop-blur-sm text-xs font-bold text-white hover:bg-white/30 transition-all"
                >
                  {isEditing ? 'Cancel' : 'Edit Budget'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-white/80 mb-2">
                      Budget Amount (PKR)
                    </label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full py-3 px-4 rounded-xl border-none text-sm font-semibold text-[#1A1A2E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-white/80 mb-2">
                      Period
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['monthly', 'weekly', 'daily'] as const).map(period => (
                        <button
                          key={period}
                          onClick={() => setNewPeriod(period)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                            newPeriod === period
                              ? 'bg-white text-[#FF6B35]'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full py-3 rounded-xl bg-white text-[#FF6B35] text-sm font-extrabold hover:bg-white/90 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>Spent: Rs.{spent.toLocaleString()}</span>
                      <span>{percentageUsed}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Remaining</span>
                    <span className="font-serif text-2xl font-semibold">Rs.{remaining.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Budget Breakdown</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFF0E8]">
                  <div className="text-xs font-bold text-[#9B96B0] mb-1">Daily Allowance</div>
                  <div className="font-serif text-2xl font-semibold text-[#FF6B35]">
                    Rs.{getDailyAllowance().toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#E8FFF5]">
                  <div className="text-xs font-bold text-[#9B96B0] mb-1">Weekly Allowance</div>
                  <div className="font-serif text-2xl font-semibold text-[#06D6A0]">
                    Rs.{getWeeklyAllowance().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Spending History - UC-09 */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">Recent Spending</h3>

              <div className="space-y-3">
                {spendingHistory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#FEFAF5] border border-[#F0EBE3]">
                    <div>
                      <div className="text-sm font-bold text-[#1A1A2E]">{item.restaurant}</div>
                      <div className="text-xs text-[#9B96B0]">
                        {new Date(item.date).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="font-serif text-lg font-semibold text-[#FF6B35]">
                      Rs.{item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats & Tips */}
          <div className="space-y-6">
            {/* Budget Status */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-lg font-semibold text-[#1A1A2E] mb-4">Budget Status</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#9B96B0]">Health</span>
                    <span className={`text-xs font-bold ${
                      percentageUsed < 50 ? 'text-[#06D6A0]' : percentageUsed < 80 ? 'text-[#FFB020]' : 'text-red-500'
                    }`}>
                      {percentageUsed < 50 ? 'Good' : percentageUsed < 80 ? 'Moderate' : 'High'}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    percentageUsed < 50 ? 'bg-[#E8FFF5]' : percentageUsed < 80 ? 'bg-[#FFF7E6]' : 'bg-red-50'
                  }`}>
                    <p className="text-xs font-semibold">
                      {percentageUsed < 50
                        ? '✓ You\'re on track with your budget!'
                        : percentageUsed < 80
                        ? '⚠ Watch your spending carefully'
                        : '⚠ You\'re approaching your budget limit'
                      }
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#F0EBE3] pt-4">
                  <div className="text-xs font-bold text-[#9B96B0] mb-2">Average Order</div>
                  <div className="font-serif text-xl font-semibold text-[#1A1A2E]">Rs.812</div>
                </div>

                <div className="border-t border-[#F0EBE3] pt-4">
                  <div className="text-xs font-bold text-[#9B96B0] mb-2">Total Orders</div>
                  <div className="font-serif text-xl font-semibold text-[#1A1A2E]">4 orders</div>
                </div>
              </div>
            </div>

            {/* Smart Tips */}
            <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl p-6 text-white">
              <h3 className="font-serif text-lg font-semibold mb-3">💡 Smart Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Use student discounts to save up to 30%</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Order during off-peak hours for better deals</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Check daily promotions before ordering</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-lg font-semibold text-[#1A1A2E] mb-3">Quick Actions</h3>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/deals')}
                  className="w-full py-3 px-4 rounded-xl bg-[#FFF0E8] text-sm font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all text-left"
                >
                  🎟️ View Deals & Vouchers
                </button>
                <button
                  onClick={() => navigate('/restaurants')}
                  className="w-full py-3 px-4 rounded-xl bg-[#E8FFF5] text-sm font-bold text-[#06D6A0] hover:bg-[#D0F5E8] transition-all text-left"
                >
                  🍽️ Browse Restaurants
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full py-3 px-4 rounded-xl bg-[#F0EBE3] text-sm font-bold text-[#4A4560] hover:bg-[#E5DFD4] transition-all text-left"
                >
                  📦 Order History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
