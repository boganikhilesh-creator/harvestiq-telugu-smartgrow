import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { marketPrices } from '@/data/farmData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarketPrices = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />
      <div className="pt-20">
        <div className="py-12" style={{ background: 'linear-gradient(135deg, hsl(42 95% 40%), hsl(28 50% 45%))' }}>
          <div className="container mx-auto px-4 text-center text-white">
            <span className="text-4xl mb-3 block">📈</span>
            <h1 className="font-display text-4xl font-bold mb-3">{t('market.title')}</h1>
            <p className="text-white/80">{t('market.subtitle')}</p>
            <p className="text-white/60 text-xs mt-2">Last updated: {new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {marketPrices.map((item, i) => {
              const isUp = item.change > 0;
              const isFlat = item.change === 0;
              return (
                <motion.div key={item.crop} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i*0.06 }}
                  className="card-harvest rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <div className="font-bold text-foreground">{language==='te' ? item.cropTe : item.crop}</div>
                        <div className="text-xs text-muted-foreground">📍 {item.market}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isUp ? 'bg-green-100 text-green-700' : isFlat ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : isFlat ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(item.change)}%
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">₹{item.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mb-3">per quintal</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-green-600">52W High</div>
                      <div className="text-sm font-bold text-green-700">₹{item.high52w.toLocaleString()}</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-red-600">52W Low</div>
                      <div className="text-sm font-bold text-red-700">₹{item.low52w.toLocaleString()}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketPrices;
