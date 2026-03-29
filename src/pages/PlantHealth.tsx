import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { diseaseDatabase } from '@/data/crops';
import { Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const cropTypes = ['rice', 'cotton', 'tomato', 'maize', 'chili'];

const PlantHealth = () => {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    healthy: boolean;
    aiLabel?: string;
    confidence?: number;
    aiDescription?: string;
    data?: typeof diseaseDatabase['rice'][0];
  }>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const analyze = async () => {
    if (!imagePreview || !selectedCrop) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('detect-plant-disease', {
        body: { imageBase64: imagePreview, cropType: selectedCrop },
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('loading')) {
          toast.info('AI model is warming up. Please try again in 30 seconds.');
        } else {
          toast.error(data.error);
        }
        setLoading(false);
        return;
      }

      const isHealthy = data.healthy;
      
      if (isHealthy) {
        setResult({ healthy: true, aiLabel: data.topLabel, confidence: data.confidence, aiDescription: data.description });
      } else {
        // Try to match AI prediction to our disease database for detailed info
        const diseases = diseaseDatabase[selectedCrop];
        const matchedDisease = diseases?.find((d) =>
          data.topLabel?.toLowerCase().includes(d.disease.toLowerCase().split(' ')[0]) ||
          d.disease.toLowerCase().includes(data.topLabel?.toLowerCase().split('_').pop() || '')
        );

        setResult({
          healthy: false,
          aiLabel: data.topLabel,
          confidence: data.confidence,
          aiDescription: data.description,
          data: matchedDisease || diseases?.[0],
        });
      }
    } catch (err) {
      console.error('Analysis error:', err);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page">
      <Navbar />
      <div className="pt-20">
        <div className="py-12" style={{ background: 'linear-gradient(135deg, hsl(145 55% 25%), hsl(28 50% 40%))' }}>
          <div className="container mx-auto px-4 text-center text-white">
            <span className="text-4xl mb-3 block">🌿</span>
            <h1 className="font-display text-4xl font-bold mb-3">{t('plant.title')}</h1>
            <p className="text-white/80">{t('plant.subtitle')}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Panel */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {/* Crop selector */}
              <div className="card-harvest rounded-xl p-5">
                <label className="block text-sm font-semibold mb-3">{t('plant.selectCrop')}</label>
                <div className="flex flex-wrap gap-2">
                  {cropTypes.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCrop(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                        selectedCrop === c
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground hover:border-primary/40'
                      }`}
                    >
                      {c === 'rice' ? '🌾' : c === 'cotton' ? '🌸' : c === 'tomato' ? '🍅' : c === 'maize' ? '🌽' : '🌶️'}{' '}
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload area */}
              <div
                className="card-harvest rounded-xl border-2 border-dashed border-primary/30 p-8 text-center cursor-pointer hover:border-primary/60 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Uploaded plant" className="w-full max-h-52 object-cover rounded-xl" />
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-primary/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">{t('plant.uploadPrompt')}</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>

              <button
                onClick={analyze}
                disabled={!imagePreview || !selectedCrop || loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> {t('plant.analyze')}
                  </>
                )}
              </button>
            </motion.div>

            {/* Results */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              {!result && !loading && (
                <div className="card-harvest rounded-xl p-10 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">🔬</div>
                  <p>Select a crop type and upload an image to detect diseases</p>
                  <p className="text-xs mt-2 text-muted-foreground/60">Powered by AI image analysis</p>
                </div>
              )}

              {loading && (
                <div className="card-harvest rounded-xl p-10 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="text-foreground font-medium">Analyzing plant health...</p>
                  <p className="text-muted-foreground text-sm mt-1">AI scanning for diseases and damage</p>
                </div>
              )}

              {result?.healthy && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-harvest rounded-xl p-8 text-center h-full flex flex-col items-center justify-center border-2 border-green-300 bg-green-50"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="font-bold text-xl text-green-700 mb-2">{t('plant.healthy')}</h3>
                  <p className="text-green-600 text-sm">No disease detected. Continue regular care and monitoring.</p>
                  {result.confidence && (
                    <p className="text-green-500 text-xs mt-2">
                      AI Confidence: {(result.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </motion.div>
              )}

              {result && !result.healthy && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                  {/* AI Detection Result */}
                  <div className="rounded-xl p-4 border-2 border-orange-300 bg-orange-50">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="font-bold text-sm text-orange-700">AI Detection</span>
                    </div>
                    <p className="text-sm text-orange-700 capitalize">{result.aiLabel?.replace(/_/g, ' ')}</p>
                     {result.confidence && (
                      <p className="text-xs text-orange-500 mt-1">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                    )}
                    {result.aiDescription && (
                      <p className="text-xs text-orange-600 mt-1">{result.aiDescription}</p>
                    )}
                  </div>

                  {result.data && (
                    <>
                      {[
                        {
                          icon: '🌿',
                          label: t('plant.disease'),
                          val: language === 'te' ? result.data.diseaseTe : result.data.disease,
                          color: 'border-red-300 bg-red-50',
                          textColor: 'text-red-700',
                        },
                        {
                          icon: '⚠️',
                          label: t('plant.cause'),
                          val: language === 'te' ? result.data.causeTe : result.data.cause,
                          color: 'border-amber-300 bg-amber-50',
                          textColor: 'text-amber-700',
                        },
                      ].map((item) => (
                        <div key={item.label} className={`rounded-xl p-4 border-2 ${item.color}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span>{item.icon}</span>
                            <span className={`font-bold text-sm ${item.textColor}`}>{item.label}</span>
                          </div>
                          <p className={`text-sm ${item.textColor}`}>{item.val}</p>
                        </div>
                      ))}
                      <div className="rounded-xl p-4 border-2 border-blue-300 bg-blue-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span>💊</span>
                          <span className="font-bold text-sm text-blue-700">{t('plant.treatment')}</span>
                        </div>
                        <ul className="space-y-1">
                          {(language === 'te' ? result.data.treatmentTe : result.data.treatment).map((item, i) => (
                            <li key={i} className="text-xs text-blue-600 flex gap-1.5">
                              <span>•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl p-4 border-2 border-green-300 bg-green-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span>🛡️</span>
                          <span className="font-bold text-sm text-green-700">{t('plant.prevention')}</span>
                        </div>
                        <ul className="space-y-1">
                          {(language === 'te' ? result.data.preventionTe : result.data.prevention).map((item, i) => (
                            <li key={i} className="text-xs text-green-600 flex gap-1.5">
                              <span>•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlantHealth;
