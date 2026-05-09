import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const { login, register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-sm z-[1000] flex items-center justify-center p-6">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in">
        <div className={`h-32 rounded-t-3xl flex items-center justify-center text-5xl ${mode === 'signup' ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]' : 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'}`}>
          {mode === 'signup' ? '👋' : '🔑'}
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#1A1A2E] mb-1.5">
            {mode === 'signup' ? 'Create your account' : 'Welcome back!'}
          </h3>
          <p className="text-[13px] text-[#9B96B0] font-medium mb-4 md:mb-5">
            {mode === 'signup' ? 'Start eating smart and saving money today.' : 'Log into your PocketPlate account.'}
          </p>

          {mode === 'signup' && (
            <div className="mb-3">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmed Ali"
                required
                className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#9B96B0] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
              required
              className="w-full py-3 px-4 rounded-xl border-[1.5px] border-[#F0EBE3] text-sm font-semibold text-[#1A1A2E] outline-none transition-colors focus:border-[#FF6B35]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl border-none text-sm font-extrabold text-white transition-all ${
              mode === 'signup'
                ? 'bg-[#FF6B35] shadow-[0_4px_14px_rgba(255,107,53,0.3)] hover:bg-[#FF8C5A]'
                : 'bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:opacity-90'
            } disabled:opacity-50`}
          >
            {loading ? (mode === 'signup' ? 'Creating...' : 'Logging in...') : (mode === 'signup' ? 'Create Account →' : 'Log In →')}
          </button>

          <p className="text-center text-xs text-[#9B96B0] mt-3">
            {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => onSwitchMode(mode === 'signup' ? 'login' : 'signup')}
              className="text-[#FF6B35] font-bold hover:underline"
            >
              {mode === 'signup' ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
