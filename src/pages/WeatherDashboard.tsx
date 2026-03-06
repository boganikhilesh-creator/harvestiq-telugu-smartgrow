import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { telanganaWeather } from '@/data/farmData';
import { RefreshCw } from 'lucide-react';

const WeatherDashboard = () => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const conditionColor: Record<string, string> = {
    'Rainy': 'from-blue-500 to-indigo-600',
    'Partly Cloudy': 'from-sky-400 to-blue-500',
    'Humid & Warm': 'from-teal-400 to-cyan-500',
    'Cloudy': 'from-slate-400 to-gray-500',
    'Hot & Humid': 'from-orange-400 to-red-500',
    'Breezy': 'from-cyan-400 to-sky-500',
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />
      <div className="pt-20">
        <div className="py-12 bg-gradient-sky">
          <div className="container mx-auto px-4 text-center text-white">
            <span className="text-4xl mb-3 block">🌤️</span>
            <h1 className="font-display text-4xl font-bold mb-3">{t('weather.title')}</h1>
            <p className="text-white/80">{t('weather.subtitle')}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Loading weather data...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {telanganaWeather.map((w, i) => {
                const gradient = conditionColor[w.condition] || 'from-sky-400 to-blue-500';
                return (
                  <motion.div
                    key={w.city}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white shadow-harvest-lg`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-display font-bold text-xl">{language === 'te' ? w.cityTe : w.city}</h3>
                        <p className="text-white/70 text-sm">{language === 'te' ? w.conditionTe : w.condition}</p>
                      </div>
                      <span className="text-4xl">{w.icon}</span>
                    </div>

                    <div className="text-5xl font-bold mb-4">{w.temp}°C</div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/20 rounded-xl p-2.5">
                        <div className="text-white/70 text-xs">{t('weather.humidity')}</div>
                        <div className="font-bold text-sm">💧 {w.humidity}%</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-2.5">
                        <div className="text-white/70 text-xs">{t('weather.rain')}</div>
                        <div className="font-bold text-sm">🌧️ {w.rainProb}%</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-2.5">
                        <div className="text-white/70 text-xs">{t('weather.wind')}</div>
                        <div className="font-bold text-sm">🌬️ {w.windSpeed} km/h</div>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/70 text-xs mb-2">{t('weather.crops')}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {w.suggestedCrops.map(c => (
                          <span key={c} className="bg-white/25 text-white text-xs px-2.5 py-1 rounded-full font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WeatherDashboard;
