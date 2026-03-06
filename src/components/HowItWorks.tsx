import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  { num: '01', icon: '🏡', key: 's1', color: 'from-primary to-primary-glow' },
  { num: '02', icon: '🤖', key: 's2', color: 'from-secondary to-amber-400' },
  { num: '03', icon: '🌾', key: 's3', color: 'from-accent to-harvest' },
];

const HowItWorks = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="badge-gold mb-4 inline-block">{t('hiw.subtitle')}</span>
          <h2 className="section-title mt-2">{t('hiw.title')}</h2>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl shadow-harvest-lg relative bg-gradient-to-br ${step.color}`}
                >
                  {step.icon}
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                    style={{ background: 'hsl(var(--foreground))' }}
                  >
                    {step.num}
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl mb-3 text-foreground">
                  {t(`hiw.${step.key}.title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {t(`hiw.${step.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
