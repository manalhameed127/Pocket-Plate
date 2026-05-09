import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, restaurants } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'restaurants' | 'integrations' | 'offers' | 'monitoring'>('users');

  // Mock admin check - in real app would verify admin role
  if (!user) {
    navigate('/home');
    return null;
  }

  // Mock data - UC-32: Manage Users
  const [users] = useState([
    { id: '1', name: 'Ahmed Ali', email: 'ahmed@example.com', status: 'Active', isStudent: true, joinedDate: '2026-03-15' },
    { id: '2', name: 'Sara Khan', email: 'sara@example.com', status: 'Active', isStudent: false, joinedDate: '2026-03-18' },
    { id: '3', name: 'Ali Hassan', email: 'ali@example.com', status: 'Active', isStudent: true, joinedDate: '2026-04-01' },
    { id: '4', name: 'Fatima Malik', email: 'fatima@example.com', status: 'Suspended', isStudent: false, joinedDate: '2026-02-20' }
  ]);

  // Mock data - UC-33: Manage Restaurants
  const [restaurantList] = useState(restaurants);

  // Mock data - UC-34: Manage Restaurant Integration
  const [integrations] = useState([
    { id: '1', restaurant: 'Karachi Biryani House', api: 'PocketPlate API v2', status: 'Connected', lastSync: '2026-04-25 10:30' },
    { id: '2', restaurant: 'Bundu Khan', api: 'PocketPlate API v2', status: 'Connected', lastSync: '2026-04-25 10:25' },
    { id: '3', restaurant: 'Kolachi', api: 'PocketPlate API v2', status: 'Error', lastSync: '2026-04-24 18:45' },
    { id: '4', restaurant: 'Student Biryani', api: 'PocketPlate API v1', status: 'Connected', lastSync: '2026-04-25 09:15' }
  ]);

  // Mock data - UC-35: Update Offers and Promotions
  const [offers] = useState([
    { id: '1', title: '30% off your order', code: 'POCKET30', status: 'Active', validUntil: '2026-04-30', usageCount: 145 },
    { id: '2', title: 'Free delivery all week', code: 'FREEDEL', status: 'Active', validUntil: '2026-05-01', usageCount: 89 },
    { id: '3', title: '15% off with HBL', code: 'HBL15', status: 'Active', validUntil: '2026-05-15', usageCount: 56 },
    { id: '4', title: 'Student special 25%', code: 'STUDENT25', status: 'Expired', validUntil: '2026-04-20', usageCount: 203 }
  ]);

  // Mock data - UC-36: Monitor System Data
  const systemStats = {
    totalUsers: 1247,
    activeOrders: 23,
    totalOrders: 5632,
    revenue: 2845600,
    avgOrderValue: 850,
    topRestaurant: 'Karachi Biryani House'
  };

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={() => {}} />

      <div className="max-w-7xl mx-auto px-6 py-9">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-[#9B96B0]">Manage platform operations and monitor performance</p>
          </div>
          <div className="py-2 px-4 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-xs font-bold">
            👑 ADMIN
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 rounded-xl text-sm font-bold border-[1.5px] transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#FFF0E8] border-[rgba(255,107,53,0.3)] text-[#FF6B35]'
                : 'bg-white border-[#F0EBE3] text-[#4A4560]'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`py-2 px-4 rounded-xl text-sm font-bold border-[1.5px] transition-all whitespace-nowrap ${
              activeTab === 'restaurants'
                ? 'bg-[#FFF0E8] border-[rgba(255,107,53,0.3)] text-[#FF6B35]'
                : 'bg-white border-[#F0EBE3] text-[#4A4560]'
            }`}
          >
            🍽️ Restaurants
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-2 px-4 rounded-xl text-sm font-bold border-[1.5px] transition-all whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'bg-[#FFF0E8] border-[rgba(255,107,53,0.3)] text-[#FF6B35]'
                : 'bg-white border-[#F0EBE3] text-[#4A4560]'
            }`}
          >
            🔌 Integrations
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-2 px-4 rounded-xl text-sm font-bold border-[1.5px] transition-all whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#FFF0E8] border-[rgba(255,107,53,0.3)] text-[#FF6B35]'
                : 'bg-white border-[#F0EBE3] text-[#4A4560]'
            }`}
          >
            🎟️ Offers
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-2 px-4 rounded-xl text-sm font-bold border-[1.5px] transition-all whitespace-nowrap ${
              activeTab === 'monitoring'
                ? 'bg-[#FFF0E8] border-[rgba(255,107,53,0.3)] text-[#FF6B35]'
                : 'bg-white border-[#F0EBE3] text-[#4A4560]'
            }`}
          >
            📊 Monitoring
          </button>
        </div>

        {/* UC-32: Manage Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E]">User Management</h2>
              <button className="py-2 px-4 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#FF8C5A] transition-all">
                + Add User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EBE3]">
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Joined</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-[#F0EBE3] hover:bg-[#FEFAF5]">
                      <td className="py-4 px-4 text-sm font-bold text-[#1A1A2E]">{u.name}</td>
                      <td className="py-4 px-4 text-sm text-[#4A4560]">{u.email}</td>
                      <td className="py-4 px-4">
                        {u.isStudent && (
                          <span className="inline-block py-1 px-2 rounded-lg bg-[#EEF2FF] text-[#6366F1] text-xs font-bold">
                            🎓 Student
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block py-1 px-2.5 rounded-lg text-xs font-bold ${
                          u.status === 'Active' ? 'bg-[#E8FFF5] text-[#06D6A0]' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#9B96B0]">{u.joinedDate}</td>
                      <td className="py-4 px-4">
                        <button className="text-xs font-bold text-[#FF6B35] hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UC-33: Manage Restaurants */}
        {activeTab === 'restaurants' && (
          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E]">Restaurant Management</h2>
              <button className="py-2 px-4 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#FF8C5A] transition-all">
                + Add Restaurant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurantList.map(rest => (
                <div key={rest.id} className="border border-[#F0EBE3] rounded-xl p-4 hover:bg-[#FEFAF5] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{rest.emoji}</div>
                    <span className="py-1 px-2 rounded-lg bg-[#E8FFF5] text-[#06D6A0] text-xs font-bold">
                      Active
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#1A1A2E] mb-1">{rest.name}</h3>
                  <p className="text-xs text-[#9B96B0] mb-3">{rest.cuisine}</p>
                  <div className="flex items-center gap-2 text-xs text-[#4A4560] mb-3">
                    <span>⭐ {rest.rating}</span>
                    <span>•</span>
                    <span>{rest.deliveryTime}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-[#FFF0E8] text-xs font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all">
                      Edit
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-[#F0EBE3] text-xs font-bold text-[#4A4560] hover:bg-[#E5DFD4] transition-all">
                      Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UC-34: Manage Restaurant Integration */}
        {activeTab === 'integrations' && (
          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E]">API Integrations</h2>
              <button className="py-2 px-4 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#FF8C5A] transition-all">
                + New Integration
              </button>
            </div>

            <div className="space-y-4">
              {integrations.map(int => (
                <div key={int.id} className="border border-[#F0EBE3] rounded-xl p-5 hover:bg-[#FEFAF5] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-[#1A1A2E] mb-1">{int.restaurant}</h3>
                      <p className="text-sm text-[#9B96B0] mb-2">{int.api}</p>
                      <p className="text-xs text-[#9B96B0]">Last synced: {int.lastSync}</p>
                    </div>
                    <span className={`py-1.5 px-3 rounded-lg text-xs font-bold ${
                      int.status === 'Connected' ? 'bg-[#E8FFF5] text-[#06D6A0]' : 'bg-red-50 text-red-600'
                    }`}>
                      {int.status === 'Connected' ? '✓ Connected' : '⚠ Error'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="py-2 px-4 rounded-lg bg-[#FFF0E8] text-xs font-bold text-[#FF6B35] hover:bg-[#FFE0C8] transition-all">
                      Test Connection
                    </button>
                    <button className="py-2 px-4 rounded-lg bg-[#F0EBE3] text-xs font-bold text-[#4A4560] hover:bg-[#E5DFD4] transition-all">
                      View Logs
                    </button>
                    <button className="py-2 px-4 rounded-lg bg-[#E8FFF5] text-xs font-bold text-[#06D6A0] hover:bg-[#D0F5E8] transition-all">
                      Sync Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UC-35: Update Offers and Promotions */}
        {activeTab === 'offers' && (
          <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E]">Offers & Promotions</h2>
              <button className="py-2 px-4 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#FF8C5A] transition-all">
                + Create Offer
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EBE3]">
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Title</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Valid Until</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Usage</th>
                    <th className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-[#9B96B0]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(offer => (
                    <tr key={offer.id} className="border-b border-[#F0EBE3] hover:bg-[#FEFAF5]">
                      <td className="py-4 px-4 text-sm font-bold text-[#1A1A2E]">{offer.title}</td>
                      <td className="py-4 px-4">
                        <code className="py-1 px-2 rounded bg-[#F0EBE3] text-xs font-bold">{offer.code}</code>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block py-1 px-2.5 rounded-lg text-xs font-bold ${
                          offer.status === 'Active' ? 'bg-[#E8FFF5] text-[#06D6A0]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#9B96B0]">{offer.validUntil}</td>
                      <td className="py-4 px-4 text-sm font-semibold text-[#4A4560]">{offer.usageCount}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="text-xs font-bold text-[#FF6B35] hover:underline">Edit</button>
                          <button className="text-xs font-bold text-red-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UC-36: Monitor System Data */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] rounded-2xl p-6 text-white">
                <div className="text-sm font-bold text-white/80 mb-2">Total Users</div>
                <div className="font-serif text-4xl font-semibold mb-1">{systemStats.totalUsers.toLocaleString()}</div>
                <div className="text-xs text-white/60">+12% from last month</div>
              </div>

              <div className="bg-gradient-to-br from-[#06D6A0] to-[#05c090] rounded-2xl p-6 text-white">
                <div className="text-sm font-bold text-white/80 mb-2">Total Revenue</div>
                <div className="font-serif text-4xl font-semibold mb-1">Rs.{(systemStats.revenue / 1000).toFixed(0)}K</div>
                <div className="text-xs text-white/60">+18% from last month</div>
              </div>

              <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl p-6 text-white">
                <div className="text-sm font-bold text-white/80 mb-2">Total Orders</div>
                <div className="font-serif text-4xl font-semibold mb-1">{systemStats.totalOrders.toLocaleString()}</div>
                <div className="text-xs text-white/60">+8% from last month</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E] mb-6">System Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-3">
                    Performance Metrics
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-[#4A4560]">Active Orders</span>
                      <span className="font-serif text-lg font-semibold text-[#FF6B35]">{systemStats.activeOrders}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-[#4A4560]">Average Order Value</span>
                      <span className="font-serif text-lg font-semibold text-[#06D6A0]">Rs.{systemStats.avgOrderValue}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-[#4A4560]">Top Restaurant</span>
                      <span className="text-sm font-bold text-[#1A1A2E]">{systemStats.topRestaurant}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-3">
                    System Health
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#4A4560]">API Performance</span>
                        <span className="font-bold text-[#06D6A0]">98%</span>
                      </div>
                      <div className="h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
                        <div className="h-full bg-[#06D6A0] rounded-full" style={{ width: '98%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#4A4560]">Server Uptime</span>
                        <span className="font-bold text-[#06D6A0]">99.9%</span>
                      </div>
                      <div className="h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
                        <div className="h-full bg-[#06D6A0] rounded-full" style={{ width: '99.9%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#4A4560]">User Satisfaction</span>
                        <span className="font-bold text-[#06D6A0]">96%</span>
                      </div>
                      <div className="h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
                        <div className="h-full bg-[#06D6A0] rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#1A1A2E] mb-4">Recent Activity</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#FEFAF5]">
                  <div className="w-10 h-10 rounded-full bg-[#E8FFF5] flex items-center justify-center text-lg">📦</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1A1A2E]">New order placed</div>
                    <div className="text-xs text-[#9B96B0]">Ahmed Ali ordered from Karachi Biryani House</div>
                  </div>
                  <div className="text-xs text-[#9B96B0]">2 min ago</div>
                </div>

                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#FEFAF5]">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center text-lg">👥</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1A1A2E]">New user registered</div>
                    <div className="text-xs text-[#9B96B0]">Zainab Hussain joined the platform</div>
                  </div>
                  <div className="text-xs text-[#9B96B0]">15 min ago</div>
                </div>

                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#FEFAF5]">
                  <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-lg">🍽️</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1A1A2E]">Restaurant menu updated</div>
                    <div className="text-xs text-[#9B96B0]">Bundu Khan added 5 new items</div>
                  </div>
                  <div className="text-xs text-[#9B96B0]">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
