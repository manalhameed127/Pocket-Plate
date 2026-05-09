import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function BudgetModal({ onClose }: { onClose: () => void }) {
  const { budget, setBudget, budgetPeriod, setBudgetPeriod } = useApp();
  const [amount, setAmount] = useState(budget.toString());
  const [period, setPeriod] = useState(budgetPeriod);

  const handleSave = () => {
    setBudget(parseInt(amount));
    setBudgetPeriod(period);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm z-[1001] flex items-center justify-center p-6">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md">
        <div className="h-32 rounded-t-3xl bg-gradient-to-br from-[#43e97b] to-[#38f9d7] flex items-center justify-center text-5xl">
          💰
        </div>

        <div className="p-5 md:p-6">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#1A1A2E] mb-1.5">Set your budget</h3>
          <p className="text-[13px] text-[#9B96B0] font-medium mb-5">
            AI will filter meals to stay within your limit.
          </p>

          <div className="mb-3">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">
              Monthly food budget (PKR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-[#06D6A0] border-none text-sm font-extrabold text-white hover:opacity-90 transition-all"
          >
            Save Budget ✓
          </button>
        </div>
      </div>
    </div>
  );
}
