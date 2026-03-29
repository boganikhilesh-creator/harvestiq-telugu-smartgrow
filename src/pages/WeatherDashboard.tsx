import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { telanganaWeather } from '@/data/farmData';
import { RefreshCw, AlertCircle } from 'lucide-react';

const API_KEY = 'b42387ab2a4dfe31122859f622f466b2';

interface OWMResponse {
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: { id: number; main: string; description: string }[];
  rain?: { '1h'?: number };
}

function owmCondition(id: number): { label: string; labelTe: string; icon: string; gradient: string } {
  if (id >= 200 && id < 300) return { label: 'Thunderstorm', labelTe: 'ఉరుముల వర్షం', icon: '⛈️', gradient: 'from-gray-600 to-slate-800' };
  if (id >= 300 && id < 400) return { label: 'Drizzle', labelTe: 'జల్లు', icon: '🌦️', gradient: 'from-sky-400 to-blue-500' };
  if (id >= 500 && id < 600) return { label: 'Rainy', labelTe: 'వర్షకారకం', icon: '🌧️', gradient: 'from-blue-500 to-indigo-600' };
  if (id >= 600 && id < 700) return { label: 'Snowy', labelTe: 'మంచు', icon: '❄️', gradient: 'from-blue-200 to-sky-300' };
  if (id >= 700 && id < 800) return { label: 'Hazy', labelTe: 'మసక', icon: '🌫️', gradient: 'from-gray-400 to-gray-500' };
  if (id === 800) return { label: 'Clear', labelTe: 'స్పష్టంగా', icon: '☀️', gradient: 'from-yellow-400 to-orange-400' };
  if (id === 801 || id === 802) return { label: 'Partly Cloudy', labelTe: 'పాక్షికంగా మేఘావృతం', icon: '⛅', gradient: 'from-sky-400 to-blue-500' };
  return { label: 'Cloudy', labelTe: 'మేఘావృతం', icon: '🌥️', gradient: 'from-slate-400 to-gray-500' };
}

async function fetchCityWeather(lat: number, lon: number): Promise<OWMResponse> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
}

const WeatherDashboard = () => {
  const { t, language } = useLanguage();

  const queries = telanganaWeather.map(city => ({
    city,
    query: useQuery<OWMResponse, Error>({
      queryKey: ['weather', city.lat, city.lon],
      queryFn: () => fetchCityWeather(city.lat, city.lon),
      staleTime: 10 * 60 * 1000,
      retry: 2,
    }),
  }));

  const isLoading = queries.some(q => q.query.isLoading);
  const hasError = queries.every(q => q.query.isError);

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
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">Loading live weather data...</p>
              </div>
            </div>
          ) : hasError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-destructive">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                <p className="font-semibold">Could not load weather data</p>
                <p className="text-sm text-muted-foreground mt-1">Check your API key or network connection</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {queries.map(({ city, query }, i) => {
                const data = query.data;
                const cond = data ? owmCondition(data.weather[0].id) : null;
                const temp = data ? Math.round(data.main.temp) : city.temp;
                const humidity = data ? data.main.humidity : city.humidity;
                const windSpeed = data ? Math.round(data.wind.speed * 3.6) : city.windSpeed;
                const rainProb = data?.rain?.['1h'] ? Math.min(Math.round(data.rain['1h'] * 100), 100) : city.rainProb;
                const gradient = cond?.gradient ?? 'from-sky-400 to-blue-500';
                const condLabel = language === 'te' ? (cond?.labelTe ?? city.conditionTe) : (cond?.label ?? city.condition);
                const icon = cond?.icon ?? city.icon;

                return (
                  <motion.div
                    key={city.city}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white shadow-harvest-lg`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-display font-bold text-xl">
                          {language === 'te' ? city.cityTe : city.city}
                        </h3>
                        <p className="text-white/70 text-sm">{condLabel}</p>
                      </div>
                      <span className="text-4xl">{icon}</span>
                    </div>

                    <div className="text-5xl font-bold mb-4">{temp}°C</div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white/20 rounded-xl p-2.5">
                        <div className="text-white/70 text-xs">{t('weather.humidity')}</div>
                        <div className="font-bold text-sm">💧 {humidity}%</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-2.5">
                        <div className="text-white/70 text-xs">{t('weather.rain')}</div>
                        <div className="font-bold text-sm">🌧️ {rainProb}%</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-2.5">
                        <div className="text-white/70 text-xs">{t('weather.wind')}</div>
                        <div className="font-bold text-sm">🌬️ {windSpeed} km/h</div>
                      </div>
                      {query.isError && (
                        <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-white/60" />
                          <span className="text-white/60 text-xs">Using cached data</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-white/70 text-xs mb-2">{t('weather.crops')}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {city.suggestedCrops.map(c => (
                          <span key={c} className="bg-white/25 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && !hasError && (
            <p className="text-center text-xs text-muted-foreground mt-8">
              Live data from OpenWeatherMap · Updates every 10 minutes
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WeatherDashboard;
