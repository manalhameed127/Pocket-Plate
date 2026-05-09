import { useApp } from '../context/AppContext';

export default function VouchersModal({ onClose }: { onClose: () => void }) {
  const { vouchers, applyVoucher } = useApp();

  const handleApply = (voucher: any) => {
    applyVoucher(voucher);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm z-[1001] flex items-center justify-center p-6">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="h-32 rounded-t-3xl bg-gradient-to-br from-[#FFD166] to-[#FF6B35] flex items-center justify-center text-5xl">
          🎟️
        </div>

        <div className="p-5 md:p-6">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#1A1A2E] mb-1.5">Your Vouchers</h3>
          <p className="text-[13px] text-[#9B96B0] font-medium mb-4">
            Apply these at checkout to save on your order.
          </p>

          <div className="grid gap-2.5 mb-4">
            {vouchers.map(voucher => (
              <div
                key={voucher.id}
                className="border-[1.5px] border-dashed border-[rgba(255,107,53,0.4)] rounded-xl p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-serif text-xl font-semibold text-[#FF6B35]">
                    {voucher.type === 'percentage' ? `${voucher.discount}% off` : `Rs.${voucher.discount} off`}
                  </div>
                  <div className="text-xs text-[#9B96B0] font-semibold">{voucher.description} · {voucher.expiresIn}</div>
                </div>
                <button
                  onClick={() => handleApply(voucher)}
                  className="py-1.5 px-3.5 rounded-lg bg-[#FF6B35] border-none text-[11px] font-extrabold text-white hover:bg-[#FF8C5A] hover:scale-105 transition-all"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#FF6B35] border-none text-sm font-extrabold text-white hover:bg-[#FF8C5A] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
