import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, Eye, EyeOff, Loader2, CheckSquare, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const REMEMBER_KEY = 'harvestiq_remembered_email';

// Robust RFC-5322-inspired email validation
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Load remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const trimmed = email.trim();
    if (!trimmed) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_RE.test(trimmed)) {
      newErrors.email = 'Enter a valid email address (e.g. name@domain.com)';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } else {
      // Save or clear remembered email
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email.trim().toLowerCase());
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      toast({ title: 'Welcome back! 🌾', description: 'You are now logged in.' });
      navigate('/');
    }
  };

  const inputBase = 'w-full py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'hsl(var(--background))' }}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--accent))' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl border" style={{ borderColor: 'hsl(var(--border))' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
              <Sprout className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-2xl gradient-text">HarvestIQ</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your farmer account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  onBlur={() => {
                    if (email && !EMAIL_RE.test(email.trim())) {
                      setErrors(p => ({ ...p, email: 'Enter a valid email address (e.g. name@domain.com)' }));
                    }
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`${inputBase} pl-10 pr-4`}
                  style={{ borderColor: errors.email ? 'hsl(var(--destructive))' : 'hsl(var(--border))' }}
                  data-testid="input-email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">⚠ {errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`${inputBase} pl-10 pr-11`}
                  style={{ borderColor: errors.password ? 'hsl(var(--destructive))' : 'hsl(var(--border))' }}
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">⚠ {errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <button
              type="button"
              onClick={() => setRememberMe(v => !v)}
              className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
              data-testid="checkbox-remember"
            >
              {rememberMe
                ? <CheckSquare className="w-4.5 h-4.5 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                : <Square className="w-4.5 h-4.5 flex-shrink-0" />
              }
              <span className={rememberMe ? 'font-medium' : ''} style={{ color: rememberMe ? 'hsl(var(--primary))' : undefined }}>
                Remember me — auto-fill my email next time
              </span>
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
              data-testid="button-login"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: 'hsl(var(--primary))' }}>
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/" className="hover:underline">← Back to HarvestIQ</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
