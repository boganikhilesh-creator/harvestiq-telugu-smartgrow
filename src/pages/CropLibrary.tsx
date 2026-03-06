import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { cropDatabase } from '@/data/crops';
import { Thermometer, Droplets, Calendar, Sprout } from 'lucide-react';

const CropLibrary = () => {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState<string|null>(null);

  const crops = Object.entries(cropDatabase);
  const crop = selected ? cropDatabase[selected] : null;

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />
      <div className="pt-20">
        <div className="py-12" style={{ background: 'linear-gradient(135deg, hsl(145 55% 28%), hsl(42 95% 45%))' }}>
          <div className="container mx-auto px-4 text-center text-white">
            <span className="text-4xl mb-3 block">📚</span>
            <h1 className="font-display text-4xl font-bold mb-3">Crop Information Library</h1>
            <p className="text-white/80">Detailed guides for major Telangana crops</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {!selected ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {crops.map(([key, c], i) => (
                <motion.button key={key} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay: i*0.05 }}
                  onClick={() => setSelected(key)}
                  className={`feature-card p-5 text-center cursor-pointer bg-gradient-to-br ${c.color}`}>
                  <div className="text-5xl mb-3">{c.emoji}</div>
                  <div className="font-bold text-white text-sm">{language==='te' ? c.nameTe : c.name}</div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <button onClick={() => setSelected(null)} className="mb-6 flex items-center gap-2 text-primary font-medium hover:underline">
                ← Back to Library
              </button>
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-5">
                <div className={`rounded-2xl p-8 text-white bg-gradient-to-br ${crop!.color}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-6xl">{crop!.emoji}</span>
                    <div>
                      <h2 className="font-display text-3xl font-bold">{language==='te' ? crop!.nameTe : crop!.name}</h2>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {crop!.season.map(s => <span key={s} className="bg-white/25 text-xs px-2 py-0.5 rounded-full capitalize">{s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Sprout, label: 'Ideal Soil', val: crop!.idealSoil.join(', '), color: 'bg-primary/10 text-primary' },
                    { icon: Thermometer, label: 'Temperature', val: crop!.idealTemp, color: 'bg-harvest/10 text-harvest' },
                    { icon: Droplets, label: 'Water Requirement', val: crop!.water, color: 'bg-sky/10 text-sky' },
                    { icon: Calendar, label: 'Market Value', val: crop!.marketValue, color: 'bg-secondary/20 text-secondary-foreground' },
                  ].map(item => (
                    <div key={item.label} className={`card-harvest rounded-xl p-4 flex gap-3 items-start`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="font-semibold text-sm text-foreground capitalize">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-harvest rounded-xl p-5">
                  <h3 className="font-bold mb-3 flex items-center gap-2">🧪 Fertilizer</h3>
                  <p className="text-sm text-foreground">{crop!.fertilizer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="card-harvest rounded-xl p-5">
                    <h3 className="font-bold mb-3 flex items-center gap-2">🐛 Pest Risks</h3>
                    <ul className="space-y-1">
                      {crop!.pests.map(p => <li key={p} className="text-sm text-foreground flex gap-2"><span className="text-red-500">⚠</span>{p}</li>)}
                    </ul>
                  </div>
                  <div className="card-harvest rounded-xl p-5">
                    <h3 className="font-bold mb-3 flex items-center gap-2">💡 Growing Tips</h3>
                    <ul className="space-y-1">
                      {crop!.tips.map(tip => <li key={tip} className="text-sm text-foreground flex gap-2"><span className="text-primary">•</span>{tip}</li>)}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CropLibrary;
