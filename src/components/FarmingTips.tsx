import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { farmingTips } from '@/data/farmData';

const FarmingTips = () => {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 section-bg-alt" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="badge-green mb-4 inline-block">Daily Insights</span>
          <h2 className="section-title mt-2">{t('tips.title')}</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t('tips.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {farmingTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-harvest rounded-xl p-5 flex gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'hsl(var(--primary-light))' }}
              >
                {tip.icon}
              </div>
              <div>
                <span className="badge-gold text-xs mb-2 inline-block">{tip.category}</span>
                <p className="text-sm text-foreground leading-relaxed">
                  {language === 'te' ? tip.tipTe : tip.tip}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FarmingTips;
