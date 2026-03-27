import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Layers, Crop, Globe,
  Edit3, Save, X, LogOut, Loader2, CheckCircle2,
  Sprout, ShieldCheck, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/* ── Constants ────────────────────────────────────── */
const DISTRICTS = [
  'Hyderabad','Warangal','Karimnagar','Nizamabad','Khammam',
  'Adilabad','Mahabubnagar','Nalgonda','Rangareddy','Medak',
];
const SOIL_TYPES = ['Clay','Sandy','Loamy','Black Soil','Red Soil','Alluvial'];
const CROP_OPTIONS = [
  'Rice','Wheat','Cotton','Sugarcane','Maize','Groundnut',
  'Turmeric','Chilies','Soybean','Sunflower','Sorghum','Millet',
];
const PHONE_RE = /^[6-9]\d{9}$/;

/* ── Completion helpers ───────────────────────────── */
const COMPLETION_FIELDS = [
  { key: 'full_name',       label: 'Full Name'        },
  { key: 'phone_number',    label: 'Phone Number'     },
  { key: 'district',        label: 'District'         },
  { key: 'farm_size',       label: 'Farm Size'        },
  { key: 'soil_type',       label: 'Soil Type'        },
  { key: 'preferred_crops', label: 'Preferred Crops'  },
];

function calcCompletion(form: FormState): number {
  const filled = COMPLETION_FIELDS.filter(f => {
    const v = form[f.key as keyof FormState];
    if (Array.isArray(v)) return v.length > 0;
    return v && String(v).trim().length > 0;
  }).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

function completionColor(pct: number) {
  if (pct < 40) return 'bg-red-500';
  if (pct < 70) return 'bg-amber-500';
  if (pct < 100) return 'bg-blue-500';
  return 'bg-green-500';
}

function completionLabel(pct: number) {
  if (pct < 40) return 'Just started';
  if (pct < 70) return 'Getting there';
  if (pct < 100) return 'Almost complete';
  return 'Profile complete!';
}

/* ── Types ────────────────────────────────────────── */
interface FormState {
  full_name: string;
  phone_number: string;
  state: string;
  district: string;
  farm_size: string;
  soil_type: string;
  preferred_crops: string[];
  preferred_language: string;
}

/* ── Avatar component ─────────────────────────────── */
const Avatar = ({ name, size = 'lg' }: { name: string; size?: 'sm' | 'lg' }) => {
  const initials = name.slice(0, 2).toUpperCase();
  const dim = size === 'lg' ? 'w-24 h-24 text-2xl' : 'w-10 h-10 text-sm';
  return (
    <div
      className={`${dim} rounded-2xl flex items-center justify-center font-bold shadow-lg flex-shrink-0`}
      style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
    >
      {initials}
    </div>
  );
};

/* ── Info row (view mode) ─────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, empty }: { icon: React.ElementType; label: string; value: string; empty?: boolean }) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'hsl(var(--primary) / 0.08)' }}>
      <Icon className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${empty ? 'text-muted-foreground italic' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  </div>
);

/* ── Crop badge toggle ────────────────────────────── */
const CropBadge = ({ crop, selected, onToggle, disabled }: { crop: string; selected: boolean; onToggle: () => void; disabled?: boolean }) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
      selected
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
    } ${disabled ? 'opacity-50 cursor-default' : ''}`}
    data-testid={`crop-${crop.toLowerCase()}`}
  >
    {selected ? '✓ ' : ''}{crop}
  </button>
);

/* ── Main Profile Page ────────────────────────────── */
const Profile = () => {
  const { user, profile, loading: authLoading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [errors,  setErrors]    = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormState>({
    full_name:          '',
    phone_number:       '',
    state:              'Telangana',
    district:           '',
    farm_size:          '',
    soil_type:          '',
    preferred_crops:    [],
    preferred_language: 'en',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setForm({
        full_name:          profile.full_name          ?? '',
        phone_number:       profile.phone_number       ?? '',
        state:              profile.state              ?? 'Telangana',
        district:           profile.district           ?? '',
        farm_size:          profile.farm_size          ?? '',
        soil_type:          profile.soil_type          ?? '',
        preferred_crops:    profile.preferred_crops    ?? [],
        preferred_language: profile.preferred_language ?? 'en',
      });
    }
  }, [profile]);

  const set = (field: keyof FormState, value: string | string[]) =>
    setForm(p => ({ ...p, [field]: value }));

  const toggleCrop = (crop: string) => {
    setForm(p => ({
      ...p,
      preferred_crops: p.preferred_crops.includes(crop)
        ? p.preferred_crops.filter(c => c !== crop)
        : [...p.preferred_crops, crop],
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim())                          e.full_name = 'Full name is required';
    if (form.phone_number && !PHONE_RE.test(form.phone_number.trim())) {
      e.phone_number = 'Enter a valid 10-digit Indian mobile number';
    }
    if (form.farm_size && (isNaN(Number(form.farm_size)) || Number(form.farm_size) < 0)) {
      e.farm_size = 'Enter a valid farm size';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;
    setSaving(true);

    // Update profiles table (existing columns)
    const { error: dbErr } = await supabase
      .from('profiles')
      .update({
        full_name:          form.full_name.trim() || null,
        district:           form.district        || null,
        soil_type:          form.soil_type       || null,
        farm_size:          form.farm_size       || null,
        preferred_language: form.preferred_language,
      })
      .eq('user_id', user.id);

    // Update user_metadata (extra fields — phone, crops, state)
    const { error: metaErr } = await supabase.auth.updateUser({
      data: {
        phone_number:    form.phone_number.trim() || null,
        preferred_crops: form.preferred_crops,
        state:           form.state,
        full_name:       form.full_name.trim() || null,
      },
    });

    setSaving(false);

    if (dbErr || metaErr) {
      toast({ title: 'Update failed', description: (dbErr || metaErr)!.message, variant: 'destructive' });
    } else {
      await refreshProfile();
      setEditing(false);
      toast({ title: 'Profile updated! 🌾', description: 'Your details have been saved.' });
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        full_name:          profile.full_name          ?? '',
        phone_number:       profile.phone_number       ?? '',
        state:              profile.state              ?? 'Telangana',
        district:           profile.district           ?? '',
        farm_size:          profile.farm_size          ?? '',
        soil_type:          profile.soil_type          ?? '',
        preferred_crops:    profile.preferred_crops    ?? [],
        preferred_language: profile.preferred_language ?? 'en',
      });
    }
    setErrors({});
    setEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  /* Loading skeleton */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--background))' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: 'hsl(var(--primary))' }} />
          <p className="text-muted-foreground text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName    = form.full_name || user.email?.split('@')[0] || 'Farmer';
  const completion     = calcCompletion(form);
  const completionCls  = completionColor(completion);

  const inputBase = 'w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all';
  const fieldBorder = (field: string) => ({
    borderColor: errors[field] ? 'hsl(var(--destructive))' : 'hsl(var(--border))',
  });

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />

      <div className="pt-20">
        {/* Hero banner */}
        <div className="py-10" style={{ background: 'var(--gradient-primary)' }}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <Avatar name={displayName} size="lg" />
              <div className="text-white text-center sm:text-left flex-1">
                <h1 className="font-display text-3xl font-bold">{displayName}</h1>
                <p className="text-white/70 text-sm mt-1">{user.email}</p>
                {form.district && (
                  <p className="text-white/60 text-xs mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3 h-3" /> {form.district}, {form.state}
                  </p>
                )}
              </div>

              {/* Completion badge */}
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/20 min-w-[140px]">
                <p className="text-white/70 text-xs mb-1.5">Profile Completion</p>
                <p className="text-2xl font-bold text-white">{completion}%</p>
                <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-white/60 text-xs mt-1.5">{completionLabel(completion)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Incomplete fields hint */}
          {completion < 100 && !editing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  Complete your profile to get better crop recommendations
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Missing: {COMPLETION_FIELDS.filter(f => {
                    const v = form[f.key as keyof FormState];
                    if (Array.isArray(v)) return v.length === 0;
                    return !v || String(v).trim().length === 0;
                  }).map(f => f.label).join(', ')}
                </p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-amber-800 hover:text-amber-900"
              >
                Edit <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* ── Left column: Account info + Actions ── */}
            <div className="space-y-5">
              {/* Account info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-harvest rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} /> Account Info
                </p>
                <InfoRow icon={Mail}    label="Email Address"   value={user.email ?? '—'} />
                <InfoRow
                  icon={User}
                  label="Member Since"
                  value={user.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '—'
                  }
                />
                <InfoRow
                  icon={CheckCircle2}
                  label="Account Status"
                  value={user.email_confirmed_at ? 'Verified ✓' : 'Pending verification'}
                />
              </motion.div>

              {/* Progress breakdown */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-harvest rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Profile Progress</p>
                <div className="space-y-2.5">
                  {COMPLETION_FIELDS.map(f => {
                    const v = form[f.key as keyof FormState];
                    const done = Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim());
                    return (
                      <div key={f.key} className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${done ? 'bg-green-500' : 'bg-border'}`}>
                          {done && <span className="text-white text-[9px]">✓</span>}
                        </div>
                        <span className={`text-sm ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{f.label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Completion</span><span className="font-bold">{completion}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${completionCls} rounded-full transition-all duration-700`} style={{ width: `${completion}%` }} />
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01]"
                    style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
                    data-testid="button-edit"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:bg-destructive/10 text-destructive"
                  style={{ borderColor: 'hsl(var(--destructive) / 0.3)' }}
                  data-testid="button-signout"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            </div>

            {/* ── Right column: Profile details ── */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* VIEW MODE */}
                {!editing && (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Personal info */}
                    <div className="card-harvest rounded-2xl p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <User className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} /> Personal Information
                      </p>
                      <InfoRow icon={User}  label="Full Name"    value={form.full_name    || 'Not set'} empty={!form.full_name} />
                      <InfoRow icon={Phone} label="Phone Number" value={form.phone_number || 'Not set'} empty={!form.phone_number} />
                      <InfoRow icon={MapPin} label="State"       value={form.state        || 'Telangana'} />
                      <InfoRow icon={MapPin} label="District"    value={form.district     || 'Not set'} empty={!form.district} />
                    </div>

                    {/* Farm info */}
                    <div className="card-harvest rounded-2xl p-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                        <Sprout className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} /> Farm Details
                      </p>
                      <InfoRow icon={Crop}   label="Farm Size"    value={form.farm_size  ? `${form.farm_size} acres` : 'Not set'} empty={!form.farm_size} />
                      <InfoRow icon={Layers} label="Soil Type"    value={form.soil_type  || 'Not set'} empty={!form.soil_type} />
                      <div className="py-3 border-b border-border last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'hsl(var(--primary) / 0.08)' }}>
                            <Crop className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground font-medium">Preferred Crops</p>
                            {form.preferred_crops.length > 0
                              ? <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {form.preferred_crops.map(c => (
                                    <span key={c} className="px-2.5 py-1 text-xs font-semibold rounded-full border border-primary/30 text-primary bg-primary/8">{c}</span>
                                  ))}
                                </div>
                              : <p className="text-sm text-muted-foreground italic mt-0.5">Not set</p>
                            }
                          </div>
                        </div>
                      </div>
                      <InfoRow icon={Globe} label="Preferred Language" value={form.preferred_language === 'te' ? 'తె Telugu' : '🌐 English'} />
                    </div>
                  </motion.div>
                )}

                {/* EDIT MODE */}
                {editing && (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSave} className="space-y-5">
                      {/* Personal info */}
                      <div className="card-harvest rounded-2xl p-6 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <User className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} /> Personal Information
                        </p>

                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name *
                          </label>
                          <input
                            type="text"
                            value={form.full_name}
                            onChange={e => { set('full_name', e.target.value); setErrors(p => ({ ...p, full_name: '' })); }}
                            placeholder="Your full name"
                            className={inputBase}
                            style={fieldBorder('full_name')}
                            data-testid="input-fullname"
                          />
                          {errors.full_name && <p className="text-xs text-destructive">⚠ {errors.full_name}</p>}
                        </div>

                        {/* Email — read only */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                          </label>
                          <input
                            type="email"
                            value={user.email ?? ''}
                            disabled
                            className={`${inputBase} opacity-60 cursor-not-allowed`}
                            style={{ borderColor: 'hsl(var(--border))' }}
                          />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone Number
                          </label>
                          <input
                            type="tel"
                            value={form.phone_number}
                            onChange={e => { set('phone_number', e.target.value); setErrors(p => ({ ...p, phone_number: '' })); }}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            className={inputBase}
                            style={fieldBorder('phone_number')}
                            data-testid="input-phone"
                          />
                          {errors.phone_number
                            ? <p className="text-xs text-destructive">⚠ {errors.phone_number}</p>
                            : <p className="text-xs text-muted-foreground">Indian mobile (6-9XXXXXXXX)</p>
                          }
                        </div>

                        {/* State + District */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> State
                            </label>
                            <input
                              type="text"
                              value={form.state}
                              disabled
                              className={`${inputBase} opacity-60 cursor-not-allowed`}
                              style={{ borderColor: 'hsl(var(--border))' }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> District
                            </label>
                            <select
                              value={form.district}
                              onChange={e => set('district', e.target.value)}
                              className={inputBase}
                              style={{ borderColor: 'hsl(var(--border))' }}
                              data-testid="select-district"
                            >
                              <option value="">Select district</option>
                              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Farm details */}
                      <div className="card-harvest rounded-2xl p-6 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Sprout className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} /> Farm Details
                        </p>

                        {/* Farm Size + Soil Type */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold flex items-center gap-1.5">
                              <Crop className="w-3.5 h-3.5 text-muted-foreground" /> Farm Size (acres)
                            </label>
                            <input
                              type="number"
                              value={form.farm_size}
                              onChange={e => { set('farm_size', e.target.value); setErrors(p => ({ ...p, farm_size: '' })); }}
                              placeholder="e.g. 5"
                              min="0"
                              className={inputBase}
                              style={fieldBorder('farm_size')}
                              data-testid="input-farmsize"
                            />
                            {errors.farm_size && <p className="text-xs text-destructive">⚠ {errors.farm_size}</p>}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-muted-foreground" /> Soil Type
                            </label>
                            <select
                              value={form.soil_type}
                              onChange={e => set('soil_type', e.target.value)}
                              className={inputBase}
                              style={{ borderColor: 'hsl(var(--border))' }}
                              data-testid="select-soil"
                            >
                              <option value="">Select soil type</option>
                              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Preferred Crops */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <Crop className="w-3.5 h-3.5 text-muted-foreground" /> Preferred Crops
                          </label>
                          <p className="text-xs text-muted-foreground">Select all crops you grow or are interested in</p>
                          <div className="flex flex-wrap gap-2">
                            {CROP_OPTIONS.map(crop => (
                              <CropBadge
                                key={crop}
                                crop={crop}
                                selected={form.preferred_crops.includes(crop)}
                                onToggle={() => toggleCrop(crop)}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Preferred Language
                          </label>
                          <div className="flex gap-3">
                            {[{ value: 'en', label: '🌐 English' }, { value: 'te', label: 'తె Telugu' }].map(lang => (
                              <button
                                key={lang.value}
                                type="button"
                                onClick={() => set('preferred_language', lang.value)}
                                className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all"
                                style={{
                                  borderColor: form.preferred_language === lang.value ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                  background: form.preferred_language === lang.value ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--background))',
                                  color: form.preferred_language === lang.value ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                                }}
                                data-testid={`lang-${lang.value}`}
                              >
                                {lang.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Save / Cancel */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={saving}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-all hover:bg-muted"
                          style={{ borderColor: 'hsl(var(--border))' }}
                          data-testid="button-cancel"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-60"
                          style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
                          data-testid="button-save"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
