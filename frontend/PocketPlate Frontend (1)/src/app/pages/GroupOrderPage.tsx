import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import Navigation from "../components/Navigation";

export default function GroupOrderPage() {
  const navigate = useNavigate();
  const { user, restaurants, cart, addToCart } = useApp();
  const [members, setMembers] = useState([
    "Ahmed Ali",
    "Sara Khan",
    "Ali Hassan",
  ]);
  const [newMember, setNewMember] = useState("");
  const [groupBudget, setGroupBudget] = useState("5000");
  const [myShare, setMyShare] = useState("1250");
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    restaurants[0],
  );

  useEffect(() => {
    if (!user) {
      navigate("/home");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleAddMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
      const newShareAmount = Math.floor(
        parseInt(groupBudget) / (members.length + 2),
      );
      setMyShare(newShareAmount.toString());
    }
  };

  const perPersonBudget = Math.floor(
    parseInt(groupBudget) / (members.length + 1),
  );

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      <Navigation onAuthClick={() => {}} />

      <div className="max-w-6xl mx-auto px-6 py-9">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A1A2E] mb-2">
          Group Ordering
        </h1>
        <p className="text-[#9B96B0] mb-8">
          Order together, split the bill easily
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Group Setup */}
          <div className="lg:col-span-1 space-y-6">
            {/* Members - UC-23 */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">
                Group Members ({members.length + 1})
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[#FFF0E8]">
                  <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white font-bold text-sm flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold">
                    {user.name} (You)
                  </span>
                </div>
                {members.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-400 text-white font-bold text-sm flex items-center justify-center">
                      {member.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-[#4A4560]">
                      {member}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddMember()
                  }
                  placeholder="Enter name..."
                  className="flex-1 py-2 px-3 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold outline-none focus:border-[#FF6B35]"
                />
                <button
                  onClick={handleAddMember}
                  className="py-2 px-4 rounded-xl bg-[#FF6B35] text-white font-bold text-sm hover:bg-[#FF8C5A] transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Budget - UC-24 */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">
                Group Budget
              </h3>

              <div className="mb-4">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                  Total Budget (PKR)
                </label>
                <input
                  type="number"
                  value={groupBudget}
                  onChange={(e) =>
                    setGroupBudget(e.target.value)
                  }
                  className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#E8FFF5] border border-[#06D6A0]">
                <div className="text-xs font-bold text-[#06D6A0] mb-1">
                  Per Person Share
                </div>
                <div className="font-serif text-2xl font-semibold text-[#06D6A0]">
                  Rs.{perPersonBudget.toLocaleString()}
                </div>
              </div>
            </div>

            {/* My Share - UC-25 */}
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">
                Customise My Share
              </h3>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-2">
                  My Budget (PKR)
                </label>
                <input
                  type="number"
                  value={myShare}
                  onChange={(e) => setMyShare(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold outline-none focus:border-[#FF6B35]"
                />
                <p className="text-xs text-[#9B96B0] mt-2">
                  Recommended: Rs.{perPersonBudget}
                </p>
              </div>
            </div>
          </div>

          {/* Cross-Restaurant Combo Builder - UC-21 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#F0EBE3] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A2E] mb-4">
                Build Cross-Restaurant Combo
              </h3>
              <p className="text-sm text-[#9B96B0] mb-6">
                Mix and match items from different restaurants
              </p>

              {/* Restaurant Selector */}
              <div className="mb-6">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#9B96B0] mb-3">
                  Select Restaurant
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {restaurants.slice(0, 6).map((rest) => (
                    <button
                      key={rest.id}
                      onClick={() =>
                        setSelectedRestaurant(rest)
                      }
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
                  Place Group Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}