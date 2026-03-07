import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back! 🌾', description: 'You are now logged in.' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'hsl(var(--background))' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--accent))' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
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
              <label className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.email ? 'hsl(var(--destructive))' : 'hsl(var(--border))',
                    '--tw-ring-color': 'hsl(var(--primary))',
                  } as React.CSSProperties}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: errors.password ? 'hsl(var(--destructive))' : 'hsl(var(--border))',
                    '--tw-ring-color': 'hsl(var(--primary))',
                  } as React.CSSProperties}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
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
