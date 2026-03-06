import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { cropDatabase, cropRecommendations } from '@/data/crops';
import { telanganaWeather } from '@/data/farmData';
import { Loader2, Sprout, Droplets, TrendingUp, Lightbulb } from 'lucide-react';

const districts = ['Hyderabad','Warangal','Karimnagar','Nizamabad','Khammam','Adilabad','Mahabubnagar','Nalgonda'];

const CropPlanner = () => {
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ district: '', soil: '', season: '', water: '', farmSize: '' });
  const [results, setResults] = useState<string[]>([]);
  const [weather, setWeather] = useState<typeof telanganaWeather[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.district || !form.soil || !form.season) {
      setError('Please fill all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const recs = cropRecommendations[form.season]?.[form.soil] || ['rice', 'maize', 'sunflower'];
      setResults(recs);
      const w = telanganaWeather.find(w => w.city.toLowerCase() === form.district.toLowerCase()) || telanganaWeather[0];
      setWeather(w);
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />
      <div className="pt-20">
        {/* Header */}
        <div className="py-12" style={{ background: 'var(--gradient-primary)' }}>
          <div className="container mx-auto px-4 text-center text-white">
            <span className="text-4xl mb-3 block">🌾</span>
            <h1 className="font-display text-4xl font-bold mb-3">{t('planner.title')}</h1>
            <p className="text-white/80">{t('planner.subtitle')}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card-harvest rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Farm Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('planner.district')} *</label>
                  <select value={form.district} onChange={e => setForm({...form, district: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm">
                    <option value="">-- {t('planner.district')} --</option>
                    {districts.map(d => <option key={d} value={d}>{t(`district.${d.toLowerCase()}`)}</option>)}
                  </select>
                </div>
                {/* Soil */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('planner.soil')} *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['clay','🧱'],['sandy','🏖️'],['loamy','🌿'],['black','⚫']].map(([v, icon]) => (
                      <button type="button" key={v} onClick={() => setForm({...form, soil: v})}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${form.soil === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
                        {icon} {t(`soil.${v}`)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Season */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('planner.season')} *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[['kharif','☔'],['rabi','🌾'],['summer','☀️']].map(([v, icon]) => (
                      <button type="button" key={v} onClick={() => setForm({...form, season: v})}
                        className={`p-3 rounded-xl border text-xs font-medium transition-all ${form.season === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:border-primary/50'}`}>
                        {icon} {t(`season.${v}`)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Water */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('planner.water')}</label>
                  <select value={form.water} onChange={e => setForm({...form, water: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm">
                    <option value="">Select...</option>
                    <option value="high">{t('water.high')}</option>
                    <option value="medium">{t('water.medium')}</option>
                    <option value="low">{t('water.low')}</option>
                  </select>
                </div>
                {/* Farm size */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">{t('planner.farmSize')}</label>
                  <input type="number" min="0.5" placeholder="e.g. 2.5" value={form.farmSize}
                    onChange={e => setForm({...form, farmSize: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Sprout className="w-4 h-4" /> {t('planner.submit')}</>}
                </button>
              </form>
            </motion.div>

            {/* Results */}
            <div className="space-y-5">
              {/* Weather */}
              {weather && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="weather-card rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    {weather.icon} {t('planner.weather')} — {language === 'te' ? weather.cityTe : weather.city}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: t('weather.temp'), value: `${weather.temp}°C`, icon: '🌡️' },
                      { label: t('weather.humidity'), value: `${weather.humidity}%`, icon: '💧' },
                      { label: t('weather.rain'), value: `${weather.rainProb}%`, icon: '🌧️' },
                      { label: t('weather.wind'), value: `${weather.windSpeed} km/h`, icon: '🌬️' },
                    ].map(item => (
                      <div key={item.label} className="bg-white/20 rounded-xl p-3">
                        <div className="text-white/70 text-xs">{item.icon} {item.label}</div>
                        <div className="text-white font-bold text-lg">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {weather.suggestedCrops.map(c => (
                      <span key={c} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{c}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Crop Results */}
              {submitted && results.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="font-display font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                    🌿 {t('planner.results')}
                  </h3>
                  <div className="space-y-4">
                    {results.slice(0,3).map((cropKey, i) => {
                      const crop = cropDatabase[cropKey];
                      if (!crop) return null;
                      return (
                        <motion.div key={cropKey} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="card-harvest rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{crop.emoji}</span>
                            <div>
                              <h4 className="font-bold text-foreground">{language === 'te' ? crop.nameTe : crop.name}</h4>
                              <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${crop.color}`}>
                                #{i + 1} Recommended
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-primary/8 rounded-lg p-3">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <TrendingUp className="w-3 h-3" /> {t('planner.yield')}
                              </div>
                              <div className="text-sm font-semibold text-foreground">{crop.yield}</div>
                            </div>
                            <div className="bg-secondary/10 rounded-lg p-3">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Droplets className="w-3 h-3" /> {t('planner.waterReq')}
                              </div>
                              <div className="text-sm font-semibold text-foreground">{crop.water}</div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                              <Lightbulb className="w-3 h-3" /> {t('planner.tips')}
                            </div>
                            <ul className="space-y-1">
                              {crop.tips.slice(0,2).map((tip, j) => (
                                <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                                  <span className="text-primary mt-0.5">•</span>{tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {!submitted && (
                <div className="card-harvest rounded-2xl p-10 text-center text-muted-foreground">
                  <div className="text-6xl mb-4">🌱</div>
                  <p>Fill in your farm details to get personalized crop recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CropPlanner;
