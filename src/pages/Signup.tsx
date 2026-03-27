import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, Eye, EyeOff, User, AtSign, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const DISTRICTS = [
  'Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam',
  'Adilabad', 'Mahabubnagar', 'Nalgonda', 'Rangareddy', 'Medak',
];

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black Soil'];

// Robust RFC-5322-inspired email validation
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak',      color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair',      color: 'bg-orange-400' };
  if (score <= 3) return { score, label: 'Good',      color: 'bg-yellow-400' };
  if (score <= 4) return { score, label: 'Strong',    color: 'bg-green-500' };
  return             { score, label: 'Very Strong', color: 'bg-emerald-500' };
}

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: '',
    soilType: '',
    farmSize: '',
  });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm,  setShowConfirm]    = useState(false);
  const [loading,      setLoading]        = useState(false);
  const [errors,       setErrors]         = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const pwStrength = form.password ? getPasswordStrength(form.password) : null;

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.username.trim()) {
      e.username = 'Username is required';
    } else if (form.username.trim().length < 3) {
      e.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) {
      e.username = 'Username can only contain letters, numbers and underscores';
    }

    if (!form.fullName.trim()) {
      e.fullName = 'Full name is required';
    }

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      e.email = 'Email is required';
    } else if (!EMAIL_RE.test(trimmedEmail)) {
      e.email = 'Enter a valid email address (e.g. name@domain.com)';
    }

    if (!form.password) {
      e.password = 'Password is required';
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      e.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          username: form.username.trim().toLowerCase(),
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setLoading(false);
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      return;
    }

    // After signup, update profile with farm details + username as display name
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        full_name: form.fullName.trim(),
        district:  form.district  || null,
        soil_type: form.soilType  || null,
        farm_size: form.farmSize  || null,
      }).eq('user_id', user.id);
    }

    setLoading(false);
    toast({
      title: 'Account created! 🌾',
      description: 'Welcome to HarvestIQ. Please check your email to verify your account.',
    });
    navigate('/');
  };

  const inputBase = 'w-full rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all';
  const fieldBorder = (field: string) => ({ borderColor: errors[field] ? 'hsl(var(--destructive))' : 'hsl(var(--border))' });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'hsl(var(--background))' }}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--secondary))' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-lg"
      >
        <div className="glass-card rounded-2xl p-8 shadow-2xl border" style={{ borderColor: 'hsl(var(--border))' }}>

          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
              <Sprout className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-2xl gradient-text">Join HarvestIQ</h1>
            <p className="text-muted-foreground text-sm mt-1">Create your smart farmer account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4" noValidate>

            {/* Account section header */}
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Information</p>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Username *</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  placeholder="e.g. raju_farmer"
                  autoComplete="username"
                  className={`${inputBase} pl-10 pr-4 py-2.5`}
                  style={fieldBorder('username')}
                  data-testid="input-username"
                />
              </div>
              {errors.username
                ? <p className="text-xs text-destructive">⚠ {errors.username}</p>
                : <p className="text-xs text-muted-foreground">Letters, numbers and _ only. Used to identify your account.</p>
              }
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => set('fullName', e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  className={`${inputBase} pl-10 pr-4 py-2.5`}
                  style={fieldBorder('fullName')}
                  data-testid="input-fullname"
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive">⚠ {errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  onBlur={() => {
                    if (form.email && !EMAIL_RE.test(form.email.trim())) {
                      setErrors(p => ({ ...p, email: 'Enter a valid email address (e.g. name@domain.com)' }));
                    }
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`${inputBase} pl-10 pr-4 py-2.5`}
                  style={fieldBorder('email')}
                  data-testid="input-email"
                />
              </div>
              {errors.email
                ? <p className="text-xs text-destructive">⚠ {errors.email}</p>
                : <p className="text-xs text-muted-foreground">Must be a real address — you'll verify it by email.</p>
              }
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Min 6 chars"
                    autoComplete="new-password"
                    className={`${inputBase} pl-10 pr-10 py-2.5`}
                    style={fieldBorder('password')}
                    data-testid="input-password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">⚠ {errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Confirm *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className={`${inputBase} pl-10 pr-10 py-2.5`}
                    style={fieldBorder('confirmPassword')}
                    data-testid="input-confirm-password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">⚠ {errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Password strength bar */}
            {pwStrength && form.password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength.score ? pwStrength.color : 'bg-border'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Password strength: <span className="font-semibold">{pwStrength.label}</span>
                  {pwStrength.score < 3 && ' — try adding uppercase letters, numbers or symbols'}
                </p>
              </div>
            )}

            {/* Farm details */}
            <div className="pt-1 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Farm Details (Optional)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">District</label>
                  <select
                    value={form.district}
                    onChange={e => set('district', e.target.value)}
                    className={`${inputBase} px-3 py-2.5`}
                    style={{ borderColor: 'hsl(var(--border))' }}
                    data-testid="select-district"
                  >
                    <option value="">Select district</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Soil Type</label>
                  <select
                    value={form.soilType}
                    onChange={e => set('soilType', e.target.value)}
                    className={`${inputBase} px-3 py-2.5`}
                    style={{ borderColor: 'hsl(var(--border))' }}
                    data-testid="select-soil"
                  >
                    <option value="">Select soil type</option>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Farm Size (acres)</label>
                <input
                  type="number"
                  value={form.farmSize}
                  onChange={e => set('farmSize', e.target.value)}
                  placeholder="e.g. 5"
                  min="0"
                  className={`${inputBase} px-4 py-2.5`}
                  style={{ borderColor: 'hsl(var(--border))' }}
                  data-testid="input-farmsize"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2 mt-1"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
              data-testid="button-signup"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'hsl(var(--primary))' }}>
              Sign in
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

export default Signup;
