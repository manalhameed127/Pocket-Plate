import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Boxes,
  Gift,
  History,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  UserCircle,
  Users,
  WalletCards,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import Navigation from "../components/Navigation";
import AuthModal from "../components/AuthModal";
import BudgetModal from "../components/BudgetModal";
import LocationModal from "../components/LocationModal";
import PreferencesModal from "../components/PreferencesModal";
import VouchersModal from "../components/VouchersModal";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    user,
    endOfMonthMode,
    toggleEndOfMonthMode,
  } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">(
    "login",
  );
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showLocationModal, setShowLocationModal] =
    useState(false);
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [showVouchersModal, setShowVouchersModal] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dayPart = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  }, []);

  const cravingIdeas = [
    "Biryani",
    "BBQ",
    "Healthy",
    "Fast Food",
    "Budget meals",
  ];

  const wheelItems = [
    {
      label: "Budget",
      icon: WalletCards,
      action: () => setShowBudgetModal(true),
    },
    {
      label: "Vouchers",
      icon: Gift,
      action: () => setShowVouchersModal(true),
    },
    {
      label: "Group",
      icon: Users,
      action: () => navigate("/group-order"),
    },
    {
      label: "Combo",
      icon: Boxes,
      action: () => navigate("/combo"),
    },
    {
      label: "Location",
      icon: MapPin,
      action: () => setShowLocationModal(true),
    },
    {
      label: "Profile",
      icon: UserCircle,
      action: () => navigate("/profile"),
    },
    {
      label: "Orders",
      icon: History,
      action: () => navigate("/orders"),
    },
    {
      label: "Cart",
      icon: ShoppingBag,
      action: () => navigate("/cart"),
    },
  ];

  const runSearch = () => {
    navigate("/restaurants");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FEFAF5] text-[#1A1A2E]">
      <Navigation
        onAuthClick={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
      />

      <main className="min-h-0 flex-1 overflow-hidden px-4 py-3 md:px-7">
        <div className="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <aside className="hidden min-h-0 rounded-[30px] border border-[#F0EBE3] bg-white/86 p-3 shadow-[0_18px_50px_rgba(26,26,46,0.08)] backdrop-blur-2xl lg:order-2 lg:block">
            <div className="h-full min-h-0">
              <section className="flex h-full min-h-0 flex-col rounded-3xl border border-[#F0EBE3] bg-white p-4">
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      Feature wheel
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={toggleEndOfMonthMode}
                    title="End-of-month mode"
                    className={`rounded-2xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition-all ${
                      endOfMonthMode
                        ? "bg-[#FF6B35] text-white"
                        : "bg-[#FFF0E8] text-[#FF6B35]"
                    }`}
                  >
                    {endOfMonthMode ? "EOM On" : "EOM"}
                  </button>
                </div>

                <div className="feature-wheel mx-auto">
                  <button
                    type="button"
                    onClick={() => setShowPrefsModal(true)}
                    className="feature-wheel-center"
                    aria-label="Open AI picks"
                  >
                    <Sparkles className="h-7 w-7" />
                    <span>AI</span>
                  </button>
                  {wheelItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.action}
                        aria-label={item.label}
                        title={item.label}
                        className="feature-wheel-item"
                        style={
                          {
                            "--angle": `${index * (360 / wheelItems.length)}deg`,
                            "--counter-angle": `${index * -(360 / wheelItems.length)}deg`,
                          } as CSSProperties
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
                <div className="mt-auto rounded-2xl bg-[#FFF0E8] px-4 py-3 text-center text-[11px] font-medium text-[#FF6B35]">
                  Tap an icon to jump in.
                </div>
              </section>
            </div>
          </aside>

          <section className="relative grid min-h-0 place-items-center overflow-hidden rounded-[34px] border border-[#F0EBE3] bg-white/72 px-6 py-6 shadow-[0_18px_60px_rgba(26,26,46,0.08)] backdrop-blur-2xl lg:order-1">
            <div className="absolute left-10 top-10 hidden h-20 w-20 rotate-[-10deg] rounded-[28px] border border-[#F0EBE3] bg-[#FFF0E8] md:block" />
            <div className="absolute bottom-10 right-12 hidden h-24 w-24 rotate-[12deg] rounded-[30px] border border-[#F0EBE3] bg-[#E8FFF5] md:block" />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
              <div className="mb-5 grid h-20 w-20 place-items-center rounded-full border-[8px] border-[#FFF0E8] bg-white shadow-[0_18px_40px_rgba(255,107,53,0.16)]">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FF6B35] text-white">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>

              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF6B35]">
                Good {dayPart}
                {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
              </p>
              <h1 className="w-full whitespace-nowrap text-4xl font-semibold leading-none tracking-tight text-[#1A1A2E] md:text-5xl xl:text-6xl">
                What are you craving?
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-[#8E89A6] md:text-[15px]">
                Search when you know the mood, or use the wheel to
                jump straight into budget, vouchers, group ordering,
                AI picks, and End-of-Month budget mode.
              </p>

              <div className="mt-7 flex w-full max-w-2xl items-center gap-2 rounded-[26px] border border-[#F0EBE3] bg-white p-2 shadow-[0_18px_44px_rgba(26,26,46,0.08)]">
                <Search className="ml-4 h-5 w-5 shrink-0 text-[#9B96B0]" />
                <input
                  type="text"
                  placeholder="Biryani, BBQ, healthy lunch..."
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") runSearch();
                  }}
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm font-medium text-[#1A1A2E] outline-none placeholder:text-[#8E89A6]"
                />
                <button
                  type="button"
                  onClick={runSearch}
                  className="flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-[#FF6B35] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,107,53,0.25)] transition-all hover:-translate-y-0.5"
                >
                  Find food
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {cravingIdeas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => navigate("/restaurants")}
                    className="rounded-2xl border border-[#F0EBE3] bg-[#FEFAF5] px-4 py-2 text-[12px] font-semibold text-[#4A4560] transition-all hover:border-[#FF6B35] hover:bg-[#FFF0E8] hover:text-[#FF6B35]"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
      {showBudgetModal && (
        <BudgetModal
          onClose={() => setShowBudgetModal(false)}
        />
      )}
      {showLocationModal && (
        <LocationModal
          onClose={() => setShowLocationModal(false)}
        />
      )}
      {showPrefsModal && (
        <PreferencesModal
          onClose={() => setShowPrefsModal(false)}
        />
      )}
      {showVouchersModal && (
        <VouchersModal
          onClose={() => setShowVouchersModal(false)}
        />
      )}
    </div>
  );
}
