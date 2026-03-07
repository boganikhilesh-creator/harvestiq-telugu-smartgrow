import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Save, Loader2, MapPin, Layers, Crop, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DISTRICTS = [
  'Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam',
  'Adilabad', 'Mahabubnagar', 'Nalgonda', 'Rangareddy', 'Medak',
];
const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black Soil'];

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    district: '',
    soil_type: '',
    farm_size: '',
    preferred_language: 'en',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        district: profile.district || '',
        soil_type: profile.soil_type || '',
        farm_size: profile.farm_size || '',
        preferred_language: profile.preferred_language || 'en',
      });
    }
  }, [profile]);

  const set = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name.trim() || null,
        district: form.district || null,
        soil_type: form.soil_type || null,
        farm_size: form.farm_size || null,
        preferred_language: form.preferred_language,
      })
      .eq('user_id', user.id);

    setLoading(false);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast({ title: 'Profile updated! 🌾', description: 'Your farm details have been saved.' });
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Farmer';
  const initials = displayName.slice(0, 2).toUpperCase();

  const selectClass = "w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all";
  const inputClass = "w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 transition-all";

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0"
            style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
          >
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold gradient-text">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-8 border shadow-xl"
          style={{ borderColor: 'hsl(var(--border))' }}
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <UserCircle className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            Profile Settings
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <UserCircle className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                placeholder="Your full name"
                className={inputClass}
                style={{ borderColor: 'hsl(var(--border))' }}
              />
            </div>

            {/* District + Soil Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> District
                </label>
                <select
                  value={form.district}
                  onChange={e => set('district', e.target.value)}
                  className={selectClass}
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  <option value="">Select district</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-muted-foreground" /> Soil Type
                </label>
                <select
                  value={form.soil_type}
                  onChange={e => set('soil_type', e.target.value)}
                  className={selectClass}
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  <option value="">Select soil type</option>
                  {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Farm Size */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-muted-foreground" /> Farm Size (acres)
              </label>
              <input
                type="number"
                value={form.farm_size}
                onChange={e => set('farm_size', e.target.value)}
                placeholder="e.g. 5"
                min="0"
                className={inputClass}
                style={{ borderColor: 'hsl(var(--border))' }}
              />
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
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
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        {/* Account info card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border mt-4"
          style={{ borderColor: 'hsl(var(--border))' }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
