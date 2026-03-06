import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

const benefits = ['b1', 'b2', 'b3', 'b4', 'b5'];

const icons = ['🎯', '📈', '🛡️', '♻️', '👆'];

const BenefitsSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 section-bg-alt" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="relative rounded-2xl p-8 overflow-hidden"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <div className="text-white">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="font-display text-3xl font-bold mb-4">
                  {t('benefits.title')}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  HarvestIQ combines satellite data, AI analysis, and local agricultural knowledge to give you the most accurate farming recommendations.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { v: '35%', l: 'Better Yield' },
                    { v: '50%', l: 'Water Saved' },
                    { v: '40%', l: 'Cost Reduced' },
                    { v: '99%', l: 'Accuracy' },
                  ].map((item) => (
                    <div
                      key={item.l}
                      className="text-center p-3 rounded-xl"
                      style={{ background: 'hsl(0 0% 100% / 0.15)' }}
                    >
                      <div className="text-2xl font-bold text-secondary">{item.v}</div>
                      <div className="text-white/70 text-xs mt-1">{item.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
            </div>
          </motion.div>

          {/* Benefits list */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-8"
            >
              <span className="badge-earth mb-4 inline-block">Why HarvestIQ?</span>
              <h2 className="section-title mt-2">{t('benefits.title')}</h2>
            </motion.div>

            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 card-harvest rounded-xl"
                >
                  <span className="text-2xl flex-shrink-0">{icons[i]}</span>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{t(`benefits.${b}`)}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
