import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

interface NavigationProps {
  onAuthClick: (mode: "login" | "signup") => void;
}

export default function Navigation({
  onAuthClick,
}: NavigationProps) {
  const navigate = useNavigate();
  const { user, logout, cart } = useApp();

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const goTo = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-[200] bg-[rgba(254,250,245,0.94)] backdrop-blur-2xl border-b border-[#F0EBE3] flex items-center justify-between px-9 py-3.5 gap-4">
      <div
        onClick={() => goTo("/home")}
        className="text-xl font-semibold tracking-tight text-[#1A1A2E] flex items-center gap-2 cursor-pointer"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
        PocketPlate
      </div>

      <div className="hidden md:flex gap-0.5">
        <button
          onClick={() => goTo("/home")}
          className="py-2 px-3.5 rounded-xl text-sm font-medium text-[#4A4560] hover:bg-[#FFF0E8] hover:text-[#FF6B35] transition-all"
        >
          Home
        </button>
        <button
          onClick={() => goTo("/restaurants")}
          className="py-2 px-3.5 rounded-xl text-sm font-medium text-[#4A4560] hover:bg-[#FFF0E8] hover:text-[#FF6B35] transition-all"
        >
          Restaurants
        </button>
        <button
          onClick={() => goTo("/combo")}
          className="py-2 px-3.5 rounded-xl text-sm font-medium text-[#4A4560] hover:bg-[#FFF0E8] hover:text-[#FF6B35] transition-all"
        >
          Combo
        </button>
        <button
          onClick={() => goTo("/deals")}
          className="py-2 px-3.5 rounded-xl text-sm font-medium text-[#4A4560] hover:bg-[#FFF0E8] hover:text-[#FF6B35] transition-all"
        >
          Deals
        </button>
        {user && (
          <button
            onClick={() => goTo("/orders")}
            className="py-2 px-3.5 rounded-xl text-sm font-medium text-[#4A4560] hover:bg-[#FFF0E8] hover:text-[#FF6B35] transition-all"
          >
            Orders
          </button>
        )}
        {user?.isAdmin && (
          <button
            onClick={() => goTo("/admin")}
            className="py-2 px-3.5 rounded-xl text-sm font-medium text-[#4A4560] hover:bg-[#FFF0E8] hover:text-[#FF6B35] transition-all"
          >
            Admin
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => goTo("/cart")}
          className="relative w-10 h-10 rounded-xl bg-[#FFF0E8] border-none flex items-center justify-center text-lg hover:bg-[#FF6B35] transition-all"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#FF6B35] text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-[#FEFAF5]">
              {cartCount}
            </span>
          )}
        </button>

        {user ? (
          <>
            <button
              onClick={() => goTo("/profile")}
              className="py-2 px-4 md:px-5 rounded-xl border-[1.5px] border-[#F0EBE3] bg-white text-[13px] font-bold text-[#1A1A2E] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
            >
              {user.name}
            </button>
            <button
              onClick={logout}
              className="py-2 px-4 md:px-5 rounded-xl bg-[#FF6B35] border-none text-[13px] font-bold text-white hover:bg-[#FF8C5A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onAuthClick("login")}
              className="py-2 px-4 md:px-5 rounded-xl border-[1.5px] border-[#F0EBE3] bg-white text-[13px] font-bold text-[#1A1A2E] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
            >
              Log in
            </button>
            <button
              onClick={() => onAuthClick("signup")}
              className="hidden md:block py-2 px-5 rounded-xl bg-[#FF6B35] border-none text-[13px] font-bold text-white hover:bg-[#FF8C5A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(255,107,53,0.3)]"
            >
              Sign up free
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
