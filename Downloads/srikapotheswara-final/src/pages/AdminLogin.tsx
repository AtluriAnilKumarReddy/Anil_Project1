import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Lock, Mail, User, ArrowLeft, ShieldCheck, Eye, EyeOff, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/contexts/AuthContext';

type Step = 'login' | 'register' | 'verify' | 'success';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login: doLogin, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = trpc.auth.registerRequest.useMutation({
    onSuccess: () => setStep('verify'),
    onError: (err) => setError(err.message),
  });

  const verifyMutation = trpc.auth.verifyOTP.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      setStep('success');
      setTimeout(() => { window.location.href = '/admin'; }, 1500);
    },
    onError: (err) => setError(err.message),
  });

  const resendMutation = trpc.auth.resendOTP.useMutation({
    onSuccess: () => setError(''),
    onError: (err) => setError(err.message),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await doLogin(email, password);
    if (!ok) setError('Invalid email or password');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    registerMutation.mutate({ email, password, fullName });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    verifyMutation.mutate({ email, otp });
  };

  const goToRegister = () => { setStep('register'); setError(''); setEmail(''); setPassword(''); };
  const goToLogin = () => { setStep('login'); setError(''); setEmail(''); setPassword(''); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-ivory px-4">
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(#D84315 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 font-body text-sm text-warm-taupe hover:text-deep-saffron transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>

        <div className="bg-white rounded-2xl border border-warm-taupe/10 shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-deep-saffron/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-deep-saffron" />
            </div>
            <h1 className="font-display text-2xl text-warm-brown">
              {step === 'login' ? 'Admin Login' : step === 'register' ? 'Create Admin Account' : step === 'verify' ? 'Verify Email' : 'Account Created!'}
            </h1>
            <p className="font-body text-sm text-warm-taupe mt-2">
              {step === 'login' ? 'Owner access only' : step === 'register' ? 'Owner registration only' : step === 'verify' ? `OTP sent to ${email}` : 'Redirecting to dashboard...'}
            </p>
          </div>

          {/* Owner-only notice */}
          {(step === 'login' || step === 'register') && (
            <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="font-body text-xs text-amber-700">
                Only <strong>srikapotheswarawomenspg@gmail.com</strong> can access admin. Contact owner for access.
              </p>
            </div>
          )}

          {/* Login Form */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg"><p className="font-body text-sm text-red-600">{error}</p></div>}
              <div>
                <label className="block font-body text-sm font-medium text-warm-brown mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-warm-taupe" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="srikapotheswarawomenspg@gmail.com"
                    className="w-full pl-11 pr-4 py-3 border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown placeholder:text-warm-taupe/50 focus:border-deep-saffron focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-warm-brown mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-warm-taupe" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
                    className="w-full pl-11 pr-11 py-3 border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown placeholder:text-warm-taupe/50 focus:border-deep-saffron focus:outline-none" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-taupe hover:text-warm-brown">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors">
                Login
              </button>
              <p className="text-center font-body text-sm text-warm-taupe">
                First time?{' '}
                <button type="button" onClick={goToRegister} className="text-deep-saffron font-medium hover:underline">Register with OTP</button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg"><p className="font-body text-sm text-red-600">{error}</p></div>}
              <div>
                <label className="block font-body text-sm font-medium text-warm-brown mb-2">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-warm-taupe" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown placeholder:text-warm-taupe/50 focus:border-deep-saffron focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-warm-brown mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-warm-taupe" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="srikapotheswarawomenspg@gmail.com"
                    className="w-full pl-11 pr-4 py-3 border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown placeholder:text-warm-taupe/50 focus:border-deep-saffron focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-warm-brown mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-warm-taupe" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                    className="w-full pl-11 pr-11 py-3 border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown placeholder:text-warm-taupe/50 focus:border-deep-saffron focus:outline-none" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-taupe hover:text-warm-brown">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={registerMutation.isPending}
                className="w-full py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {registerMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {registerMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
              </button>
              <p className="text-center font-body text-sm text-warm-taupe">
                Already registered?{' '}
                <button type="button" onClick={goToLogin} className="text-deep-saffron font-medium hover:underline">Login</button>
              </p>
            </form>
          )}

          {/* Verify OTP Form */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-5">
              {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg"><p className="font-body text-sm text-red-600">{error}</p></div>}

              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-body text-sm text-green-700">
                  An OTP has been sent to <strong>{email}</strong>. Please check your inbox and enter the code below.
                </p>
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-warm-brown mb-2">Enter 6-digit OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000"
                  className="w-full px-4 py-3 border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown text-center tracking-[0.5em] text-lg placeholder:text-warm-taupe/50 placeholder:tracking-normal placeholder:text-sm focus:border-deep-saffron focus:outline-none" required maxLength={6} />
              </div>
              <button type="submit" disabled={verifyMutation.isPending || otp.length !== 6}
                className="w-full py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {verifyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {verifyMutation.isPending ? 'Verifying...' : 'Verify & Create Account'}
              </button>
              <div className="flex items-center justify-between">
                <button type="button" onClick={goToLogin} className="font-body text-sm text-warm-taupe hover:text-deep-saffron">Back to Login</button>
                <button type="button" onClick={() => resendMutation.mutate({ email })} disabled={resendMutation.isPending}
                  className="font-body text-sm text-deep-saffron hover:underline disabled:opacity-50">
                  {resendMutation.isPending ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="font-body text-sm text-warm-taupe">Account verified! Redirecting to admin...</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center font-body text-xs text-warm-taupe/40 mt-6">
          This is a restricted area. Unauthorized access is not allowed.
        </p>
      </div>
    </div>
  );
}
