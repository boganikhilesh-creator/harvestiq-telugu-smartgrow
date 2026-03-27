import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { cropDatabase } from '@/data/crops';
import { soilProfiles, inferSoilFromDistrict, type SoilType } from '@/data/soilData';
import { getRecommendations, type RecommendationResult, type WeatherInput } from '@/data/recommendationEngine';
import { telanganaWeather } from '@/data/farmData';
import {
  Loader2, Sprout, Droplets, TrendingUp, Lightbulb,
  CloudRain, Thermometer, Wind, ShieldCheck, AlertTriangle,
  Layers, FlaskConical, CheckCircle2, XCircle,
} from 'lucide-react';

const DISTRICTS = ['Hyderabad','Warangal','Karimnagar','Nizamabad','Khammam','Adilabad','Mahabubnagar','Nalgonda'];
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const riskConfig = {
  Low:    { color: 'text-green-600 bg-green-50 border-green-200',  icon: CheckCircle2,    dot: 'bg-green-500' },
  Medium: { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertTriangle,   dot: 'bg-amber-500' },
  High:   { color: 'text-red-600 bg-red-50 border-red-200',       icon: XCircle,         dot: 'bg-red-500'   },
};

async function fetchWeather(district: string): Promise<WeatherInput> {
  const cityData = telanganaWeather.find(w => w.city.toLowerCase() === district.toLowerCase());
  if (!cityData) return { temp: 30, humidity: 60, rainProb: 30, windSpeed: 12, condition: 'Clear' };

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.lat}&lon=${cityData.lon}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      rainProb: data.rain?.['1h'] ? Math.min(Math.round(data.rain['1h'] * 100), 100) : cityData.rainProb,
      windSpeed: Math.round(data.wind.speed * 3.6),
      condition: data.weather[0].main,
    };
  } catch {
    // Fallback to static data
    return {
      temp: cityData.temp,
      humidity: cityData.humidity,
      rainProb: cityData.rainProb,
      windSpeed: cityData.windSpeed,
      condition: cityData.condition,
    };
  }
}

const CropPlanner = () => {
  const { t, language } = useLanguage();
  const [district, setDistrict] = useState('');
  const [season, setSeason] = useState('');
  const [water, setWater] = useState('medium');
  const [farmSize, setFarmSize] = useState('');
  const [soilOverride, setSoilOverride] = useState<SoilType | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState<WeatherInput | null>(null);
  const [inferredSoil, setInferredSoil] = useState<SoilType | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  const effectiveSoil: SoilType = (soilOverride || inferredSoil) as SoilType ?? 'red';

  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    setSoilOverride('');
    if (val) setInferredSoil(inferSoilFromDistrict(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district || !season) { setError('Please select district and season.'); return; }
    setError('');
    setLoading(true);
    setSubmitted(false);

    const soil = effectiveSoil;
    const staticCity = telanganaWeather.find(w => w.city.toLowerCase() === district.toLowerCase());

    let wxData: WeatherInput;
    let fallback = false;
    try {
      wxData = await fetchWeather(district);
      // Detect fallback: if temp exactly matches static and it's a known city
      if (staticCity && wxData.temp === staticCity.temp && wxData.humidity === staticCity.humidity) {
        fallback = true;
      }
    } catch {
      wxData = { temp: 30, humidity: 60, rainProb: 30, windSpeed: 12, condition: 'Clear' };
      fallback = true;
    }

    setUsedFallback(fallback);
    setWeather(wxData);
    const recs = getRecommendations(soil, wxData, season, water);
    setRecommendations(recs);
    setLoading(false);
    setSubmitted(true);
  };

  const soil = inferredSoil ? soilProfiles[effectiveSoil] : null;

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

        <div className="container mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* ── Form ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 card-harvest rounded-2xl p-7 self-start"
            >
              <h2 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" /> Farm Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t('planner.district')} *
                  </label>
                  <select
                    value={district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    data-testid="select-district"
                  >
                    <option value="">— Select district —</option>
                    {DISTRICTS.map(d => (
                      <option key={d} value={d}>{t(`district.${d.toLowerCase()}`)}</option>
                    ))}
                  </select>
                </div>

                {/* Inferred soil badge */}
                {inferredSoil && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-primary/8 border border-primary/20"
                  >
                    <Layers className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Inferred soil type</p>
                      <p className="text-sm font-semibold text-primary truncate">
                        {soilProfiles[inferredSoil].icon} {soilProfiles[inferredSoil].label}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Soil override */}
                {inferredSoil && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Override soil type (optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['black','red','loamy','sandy','clay','alluvial'] as SoilType[]).map(s => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setSoilOverride(soilOverride === s ? '' : s)}
                          className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                            (soilOverride === s) || (!soilOverride && inferredSoil === s)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                          data-testid={`soil-${s}`}
                        >
                          {soilProfiles[s].icon} {soilProfiles[s].label.split(' ')[0]} {soilProfiles[s].label.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Season */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t('planner.season')} *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[['kharif','☔'],['rabi','🌾'],['summer','☀️']] .map(([v, icon]) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setSeason(v)}
                        className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                          season === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:border-primary/50'
                        }`}
                        data-testid={`season-${v}`}
                      >
                        {icon} {t(`season.${v}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Water */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t('planner.water')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[['high','💧💧'],['medium','💧'],['low','🏜️']].map(([v, icon]) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setWater(v)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          water === v ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:border-primary/50'
                        }`}
                        data-testid={`water-${v}`}
                      >
                        {icon} {t(`water.${v}`).split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Farm size */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    {t('planner.farmSize')}
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    placeholder="e.g. 2.5"
                    value={farmSize}
                    onChange={e => setFarmSize(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                    data-testid="input-farmsize"
                  />
                </div>

                {error && (
                  <p className="text-destructive text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />{error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  data-testid="button-submit"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                    : <><Sprout className="w-4 h-4" /> {t('planner.submit')}</>
                  }
                </button>
              </form>
            </motion.div>

            {/* ── Results Panel ── */}
            <div className="lg:col-span-3 space-y-5">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card-harvest rounded-2xl p-12 text-center"
                  >
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                    <p className="font-semibold text-foreground">Fetching live weather & analyzing…</p>
                    <p className="text-sm text-muted-foreground mt-1">Checking soil, weather, and season data</p>
                  </motion.div>
                )}

                {!loading && !submitted && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card-harvest rounded-2xl p-12 text-center text-muted-foreground"
                  >
                    <div className="text-6xl mb-4">🌱</div>
                    <p className="font-medium">Select your district and season to get AI-powered crop recommendations</p>
                    <p className="text-sm mt-2 opacity-70">We'll fetch live weather + infer your soil type automatically</p>
                  </motion.div>
                )}

                {!loading && submitted && (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                    {/* Fallback notice */}
                    {usedFallback && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        Using historical weather data — live API unavailable for this district.
                      </div>
                    )}

                    {/* Soil + Weather row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Soil card */}
                      {soil && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`rounded-2xl p-5 bg-gradient-to-br ${soil.color} text-white`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-4 h-4 text-white/80" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Soil Profile</span>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{soil.icon}</span>
                            <div>
                              <p className="font-bold text-lg leading-tight">{soil.label}</p>
                              <p className="text-white/70 text-xs">{soilOverride ? 'Manually selected' : 'Inferred from location'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: 'pH Range', value: `${soil.phRange[0]}–${soil.phRange[1]}`, icon: FlaskConical },
                              { label: 'Moisture',  value: soil.moisture.charAt(0).toUpperCase() + soil.moisture.slice(1),  icon: Droplets },
                              { label: 'Fertility',  value: soil.fertility.charAt(0).toUpperCase() + soil.fertility.slice(1), icon: Sprout },
                              { label: 'Texture',   value: soil.texture.charAt(0).toUpperCase() + soil.texture.slice(1),   icon: Layers },
                            ].map(item => (
                              <div key={item.label} className="bg-white/15 rounded-xl p-2.5">
                                <div className="text-white/60 text-xs flex items-center gap-1 mb-0.5">
                                  <item.icon className="w-3 h-3" /> {item.label}
                                </div>
                                <div className="font-semibold text-sm">{item.value}</div>
                              </div>
                            ))}
                          </div>
                          <p className="text-white/70 text-xs mt-3 leading-relaxed">{soil.description}</p>
                        </motion.div>
                      )}

                      {/* Weather card */}
                      {weather && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 }}
                          className="weather-card rounded-2xl p-5"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <CloudRain className="w-4 h-4 text-white/80" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Live Weather — {district}</span>
                          </div>
                          <p className="text-4xl font-bold mb-4">{weather.temp}°C</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: t('weather.humidity'), value: `${weather.humidity}%`,          icon: Droplets },
                              { label: t('weather.rain'),     value: `${weather.rainProb}%`,           icon: CloudRain },
                              { label: t('weather.wind'),     value: `${weather.windSpeed} km/h`,      icon: Wind },
                              { label: 'Condition',           value: weather.condition,                icon: Thermometer },
                            ].map(item => (
                              <div key={item.label} className="bg-white/20 rounded-xl p-2.5">
                                <div className="text-white/70 text-xs flex items-center gap-1 mb-0.5">
                                  <item.icon className="w-3 h-3" /> {item.label}
                                </div>
                                <div className="font-bold text-sm">{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Crop recommendations */}
                    <div>
                      <h3 className="font-display font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                        🌿 {t('planner.results')}
                      </h3>

                      <div className="space-y-4">
                        {recommendations.map((rec, i) => {
                          const crop = cropDatabase[rec.cropKey];
                          if (!crop) return null;
                          const risk = riskConfig[rec.riskLevel];
                          const RiskIcon = risk.icon;

                          return (
                            <motion.div
                              key={rec.cropKey}
                              initial={{ opacity: 0, x: 24 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                              className="card-harvest rounded-2xl p-5"
                            >
                              {/* Crop header */}
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">{crop.emoji}</span>
                                  <div>
                                    <h4 className="font-bold text-foreground text-lg leading-tight">
                                      {language === 'te' ? crop.nameTe : crop.name}
                                    </h4>
                                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${crop.color} mt-1`}>
                                      #{rec.rank} Recommended · {rec.confidence}% match
                                    </div>
                                  </div>
                                </div>

                                {/* Risk badge */}
                                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border flex-shrink-0 ${risk.color}`}>
                                  <RiskIcon className="w-3.5 h-3.5" />
                                  {rec.riskLevel} Risk
                                </div>
                              </div>

                              {/* AI Reason */}
                              <div className="bg-primary/5 border border-primary/15 rounded-xl p-3.5 mb-4">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1.5">
                                  <Lightbulb className="w-3.5 h-3.5" /> AI Analysis
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">{rec.reason}</p>
                              </div>

                              {/* Match factors + warnings */}
                              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                {rec.matchFactors.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Why it fits
                                    </p>
                                    <ul className="space-y-1">
                                      {rec.matchFactors.slice(0,3).map((f, j) => (
                                        <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                                          <span className="text-green-500 mt-0.5">✓</span>{f}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {rec.warnings.length > 0 && (
                                  <div>
                                    <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                                      <AlertTriangle className="w-3.5 h-3.5" /> Watch out
                                    </p>
                                    <ul className="space-y-1">
                                      {rec.warnings.slice(0,2).map((w, j) => (
                                        <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                                          <span className="text-amber-500 mt-0.5">⚠</span>{w}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Crop stats */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-primary/8 rounded-xl p-3">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <TrendingUp className="w-3 h-3" /> {t('planner.yield')}
                                  </div>
                                  <div className="text-sm font-semibold text-foreground">{crop.yield}</div>
                                </div>
                                <div className="bg-secondary/10 rounded-xl p-3">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                    <Droplets className="w-3 h-3" /> {t('planner.waterReq')}
                                  </div>
                                  <div className="text-sm font-semibold text-foreground">{crop.water}</div>
                                </div>
                              </div>

                              {/* Growing tips */}
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                  <ShieldCheck className="w-3.5 h-3.5" /> {t('planner.tips')}
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
                    </div>

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

export default CropPlanner;
