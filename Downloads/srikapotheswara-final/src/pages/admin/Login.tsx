import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { trpc } from '@/providers/trpc';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("admin_auth", "true");
      localStorage.setItem("admin_token", data.token);
      onLogin();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-dark-brown flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-amber-accent">SRI KAPOTHESWARA</h1>
          <p className="font-body text-sm text-warm-ivory/40 mt-1">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-warm-ivory/5 border border-warm-ivory/10 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-accent/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-amber-accent" />
            </div>
          </div>

          <h2 className="font-display text-xl text-warm-ivory text-center mb-2">Admin Access</h2>
          <p className="font-body text-sm text-warm-ivory/50 text-center mb-6">
            Enter your email and password to access the admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-ivory/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter email"
                  className={`w-full pl-11 pr-4 py-3 bg-warm-ivory/5 border rounded-xl font-body text-sm text-warm-ivory placeholder:text-warm-ivory/30 focus:outline-none transition-colors ${
                    error ? 'border-red-400' : 'border-warm-ivory/20 focus:border-amber-accent'
                  }`}
                  autoFocus
                />
              </div>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-ivory/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className={`w-full pl-11 pr-12 py-3 bg-warm-ivory/5 border rounded-xl font-body text-sm text-warm-ivory placeholder:text-warm-ivory/30 focus:outline-none transition-colors ${
                  error ? 'border-red-400' : 'border-warm-ivory/20 focus:border-amber-accent'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-ivory/30 hover:text-warm-ivory/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="font-body text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-warm-ivory/10 text-center">
            <a href="/" className="font-body text-sm text-warm-ivory/40 hover:text-amber-accent transition-colors">
              Back to Website
            </a>
          </div>
        </div>

        {/* Credentials hint */}
        <p className="font-body text-xs text-warm-ivory/20 text-center mt-4">
          Email: <span className="text-warm-ivory/30">srikapotheswarawomenspg@gmail.com</span>
        </p>
      </div>
    </div>
  );
}
