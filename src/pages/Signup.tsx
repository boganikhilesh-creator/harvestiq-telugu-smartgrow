import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const DISTRICTS = [
  'Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam',
  'Adilabad', 'Mahabubnagar', 'Nalgonda', 'Rangareddy', 'Medak',
];

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black Soil'];

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: '',
    soilType: '',
    farmSize: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setLoading(false);
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      return;
    }

    // Update profile with additional farm details after signup
    // This happens after the auth trigger creates the profile row
    const { data: { user } } = await supabase.auth.getUser();
    if (user && (form.district || form.soilType || form.farmSize)) {
      await supabase.from('profiles').update({
        district: form.district || null,
        soil_type: form.soilType || null,
        farm_size: form.farmSize || null,
      }).eq('user_id', user.id);
    }

    setLoading(false);
    toast({
      title: 'Account created! 🌾',
      description: 'Welcome to HarvestIQ. Check your email to verify your account.',
    });
    navigate('/');
  };

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all ${errors[field] ? 'border-destructive' : ''}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'hsl(var(--background))' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'hsl(var(--secondary))' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Your full name" className={inputClass('fullName')} />
              </div>
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="farmer@example.com" className={inputClass('email')} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 chars" className={`${inputClass('password')} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password" className={`${inputClass('confirmPassword')} pr-10`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Farm details header */}
            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Farm Details (Optional)</p>
              <div className="grid grid-cols-2 gap-3">
                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">District</label>
                  <select
                    value={form.district}
                    onChange={e => set('district', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'hsl(var(--border))' }}
                  >
                    <option value="">Select district</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Soil Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Soil Type</label>
                  <select
                    value={form.soilType}
                    onChange={e => set('soilType', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: 'hsl(var(--border))' }}
                  >
                    <option value="">Select soil type</option>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Farm size */}
              <div className="mt-3 space-y-1.5">
                <label className="text-sm font-medium">Farm Size (acres)</label>
                <input
                  type="number"
                  value={form.farmSize}
                  onChange={e => set('farmSize', e.target.value)}
                  placeholder="e.g. 5"
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'hsl(var(--border))' }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
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
