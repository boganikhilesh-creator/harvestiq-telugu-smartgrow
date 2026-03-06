import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { smartAlerts } from '@/data/farmData';

const severityStyles = {
  high: {
    border: 'border-l-4 border-red-500',
    bg: 'bg-red-50',
    badge: 'bg-red-100 text-red-700',
    badgeText: 'High Alert',
  },
  medium: {
    border: 'border-l-4 border-amber-500',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    badgeText: 'Advisory',
  },
  low: {
    border: 'border-l-4 border-green-500',
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-700',
    badgeText: 'Info',
  },
};

const SmartAlerts = () => {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="badge-earth mb-4 inline-block">Live Updates</span>
          <h2 className="section-title mt-2">{t('alerts.title')}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {smartAlerts.map((alert, i) => {
            const style = severityStyles[alert.severity as keyof typeof severityStyles];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`rounded-xl p-5 ${style.border} ${style.bg} relative overflow-hidden`}
              >
                {/* Pulse indicator */}
                {alert.severity === 'high' && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                )}

                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{alert.icon}</span>
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {style.badgeText}
                    </span>
                    <h3 className="font-bold text-foreground mt-1 text-sm">
                      {language === 'te' ? alert.titleTe : alert.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {language === 'te' ? alert.descTe : alert.desc}
                </p>

                <div className="flex flex-wrap gap-1">
                  {alert.districts.map((d) => (
                    <span key={d} className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-foreground/70 font-medium">
                      📍 {d}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SmartAlerts;
