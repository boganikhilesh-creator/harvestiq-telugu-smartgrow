import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { marketPrices as staticPrices, type MarketPrice } from '@/data/farmData';
import {
  TrendingUp, TrendingDown, Minus, Loader2, RefreshCw,
  AlertTriangle, Search, MapPin, Calendar,
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_DATA_GOV_API_KEY;
// data.gov.in – Current Daily Price API (commodity-wise)
const API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Commodities we care about + their API search name
const COMMODITY_MAP: Record<string, { apiName: string; emoji: string; cropTe: string }> = {
  Rice:       { apiName: 'Rice',       emoji: '🌾', cropTe: 'వరి' },
  Cotton:     { apiName: 'Cotton',     emoji: '🌸', cropTe: 'పత్తి' },
  Maize:      { apiName: 'Maize',      emoji: '🌽', cropTe: 'మొక్కజొన్న' },
  Tomato:     { apiName: 'Tomato',     emoji: '🍅', cropTe: 'టమాటా' },
  Chili:      { apiName: 'Chilli',     emoji: '🌶️', cropTe: 'మిరప' },
  Turmeric:   { apiName: 'Turmeric',   emoji: '🟡', cropTe: 'పసుపు' },
  'Red Gram': { apiName: 'Arhar(Tur)', emoji: '🫘', cropTe: 'కందిపప్పు' },
  Groundnut:  { apiName: 'Groundnut',  emoji: '🥜', cropTe: 'వేరుశనగ' },
  Sunflower:  { apiName: 'Sunflower Seed', emoji: '🌻', cropTe: 'సూర్యకాంతి' },
  Wheat:      { apiName: 'Wheat',      emoji: '🌿', cropTe: 'గోధుమ' },
};

interface ApiRecord {
  commodity: string;
  market:    string;
  state:     string;
  modal_price: string;
  min_price:   string;
  max_price:   string;
  arrival_date: string;
}

function buildLivePrice(crop: string, records: ApiRecord[]): MarketPrice | null {
  const meta = COMMODITY_MAP[crop];
  if (!records.length || !meta) return null;

  // Prefer Telangana markets, else take first record
  const tgRecord = records.find(r => r.state.toLowerCase().includes('telangana'))
    || records[0];

  const price  = Math.round(Number(tgRecord.modal_price) || 0);
  const low    = Math.round(Number(tgRecord.min_price)   || price * 0.85);
  const high   = Math.round(Number(tgRecord.max_price)   || price * 1.15);

  // Find static baseline for % change reference
  const base = staticPrices.find(s => s.crop === crop);
  const change = base && base.price
    ? Math.round(((price - base.price) / base.price) * 100 * 10) / 10
    : 0;

  return {
    crop,
    cropTe: meta.cropTe,
    emoji:  meta.emoji,
    price,
    change,
    market: tgRecord.market,
    unit:   'quintal',
    high52w: Math.max(high, base?.high52w ?? high),
    low52w:  Math.min(low,  base?.low52w  ?? low),
  };
}

async function fetchLivePrices(): Promise<MarketPrice[]> {
  const results: MarketPrice[] = [];

  await Promise.all(
    Object.entries(COMMODITY_MAP).map(async ([crop, meta]) => {
      try {
        const params = new URLSearchParams({
          'api-key': API_KEY,
          format:    'json',
          limit:     '10',
          'filters[commodity]': meta.apiName,
          'filters[state]':     'Telangana',
        });
        const res = await fetch(`${API_URL}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const records: ApiRecord[] = json.records ?? [];
        const price = buildLivePrice(crop, records);
        if (price && price.price > 0) results.push(price);
      } catch {
        // Fall back silently; we'll fill from static
      }
    })
  );

  // Merge: live prices override static; fill gaps with static
  const liveCrops = new Set(results.map(r => r.crop));
  for (const s of staticPrices) {
    if (!liveCrops.has(s.crop)) results.push(s);
  }

  // Keep original order
  const order = Object.keys(COMMODITY_MAP);
  return results.sort((a, b) => order.indexOf(a.crop) - order.indexOf(b.crop));
}

const MarketPrices = () => {
  const { t, language } = useLanguage();

  const [prices,    setPrices]    = useState<MarketPrice[]>(staticPrices);
  const [loading,   setLoading]   = useState(true);
  const [isLive,    setIsLive]    = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [search,    setSearch]    = useState('');
  const [sortBy,    setSortBy]    = useState<'default' | 'priceAsc' | 'priceDesc' | 'change'>('default');
  const [error,     setError]     = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const live = await fetchLivePrices();
      const liveCount = live.filter(p =>
        !staticPrices.some(s => s.crop === p.crop && s.price === p.price)
      ).length;
      setPrices(live);
      setIsLive(liveCount > 0);
      setLastFetch(new Date());
    } catch {
      setError('Could not fetch live prices. Showing last known data.');
      setPrices(staticPrices);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = prices
    .filter(p => {
      const name = language === 'te' ? p.cropTe : p.crop;
      return name.toLowerCase().includes(search.toLowerCase()) ||
             p.market.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc')  return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'change')    return b.change - a.change;
      return 0;
    });

  const gainers  = prices.filter(p => p.change > 0).length;
  const losers   = prices.filter(p => p.change < 0).length;

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />
      <div className="pt-20">
        {/* Header */}
        <div className="py-12" style={{ background: 'linear-gradient(135deg, hsl(42 95% 40%), hsl(28 50% 45%))' }}>
          <div className="container mx-auto px-4 text-center text-white">
            <span className="text-4xl mb-3 block">📈</span>
            <h1 className="font-display text-4xl font-bold mb-3">{t('market.title')}</h1>
            <p className="text-white/80">{t('market.subtitle')}</p>
            <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
              {isLive
                ? <span className="flex items-center gap-1.5 text-xs bg-green-500/20 text-green-200 border border-green-400/30 px-3 py-1.5 rounded-full font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Live data from Agmarknet
                  </span>
                : <span className="flex items-center gap-1.5 text-xs bg-white/15 text-white/70 border border-white/20 px-3 py-1.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Using reference data
                  </span>
              }
              {lastFetch && (
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <Calendar className="w-3 h-3" />
                  Updated {lastFetch.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Crops Tracked', value: prices.length,  color: 'text-foreground' },
              { label: 'Rising Today',  value: gainers,         color: 'text-green-600'  },
              { label: 'Falling Today', value: losers,          color: 'text-red-600'    },
            ].map(stat => (
              <div key={stat.label} className="card-harvest rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs mb-5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search crop or market…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="default">Default order</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="change">Biggest movers</option>
            </select>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Loading overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Fetching live mandi prices from Agmarknet…
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price cards */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, i) => {
                const isUp   = item.change > 0;
                const isFlat = item.change === 0;
                return (
                  <motion.div
                    key={item.crop}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-harvest rounded-xl p-5"
                    data-testid={`card-crop-${item.crop.toLowerCase().replace(' ', '-')}`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <p className="font-bold text-foreground">
                            {language === 'te' ? item.cropTe : item.crop}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />{item.market}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isUp   ? 'bg-green-100 text-green-700'
                               : isFlat ? 'bg-gray-100 text-gray-600'
                                        : 'bg-red-100 text-red-700'
                      }`}>
                        {isUp   ? <TrendingUp   className="w-3 h-3" />
                                : isFlat ? <Minus className="w-3 h-3" />
                                         : <TrendingDown className="w-3 h-3" />}
                        {isFlat ? '—' : `${isUp ? '+' : ''}${item.change}%`}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-foreground">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">/ quintal</span>
                    </div>

                    {/* 52W range */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-green-600">52W High</p>
                        <p className="text-sm font-bold text-green-700">₹{item.high52w.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-red-600">52W Low</p>
                        <p className="text-sm font-bold text-red-700">₹{item.low52w.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Range bar */}
                    <div className="mt-3">
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: item.high52w > item.low52w
                              ? `${Math.min(100, Math.max(5, ((item.price - item.low52w) / (item.high52w - item.low52w)) * 100))}%`
                              : '50%',
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                        <span>52W Low</span><span>Current</span><span>52W High</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-3xl mb-2">🔍</p>
              <p>No crops match "{search}"</p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            Prices sourced from Agmarknet (data.gov.in) — official Government of India mandi data. All prices in ₹/quintal.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketPrices;
