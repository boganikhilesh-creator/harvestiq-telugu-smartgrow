import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CloudSun, Sprout, Bug, BookOpen, TrendingUp, Globe } from 'lucide-react';

const features = [
  {
    key: 'f1', icon: CloudSun, color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-light', iconColor: 'text-sky-DEFAULT',
  },
  {
    key: 'f2', icon: Sprout, color: 'from-green-400 to-emerald-500',
    bg: 'bg-primary-light', iconColor: 'text-primary',
  },
  {
    key: 'f3', icon: Bug, color: 'from-orange-400 to-red-500',
    bg: 'bg-harvest-light', iconColor: 'text-harvest',
  },
  {
    key: 'f4', icon: BookOpen, color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-100', iconColor: 'text-violet-600',
  },
  {
    key: 'f5', icon: TrendingUp, color: 'from-amber-400 to-yellow-500',
    bg: 'bg-secondary-light', iconColor: 'text-secondary-foreground',
  },
  {
    key: 'f6', icon: Globe, color: 'from-teal-400 to-cyan-500',
    bg: 'bg-teal-100', iconColor: 'text-teal-600',
  },
];

const FeaturesSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 section-bg-alt" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="badge-green mb-4 inline-block">{t('features.subtitle')}</span>
          <h2 className="section-title mt-2">{t('features.title')}</h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.key}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="feature-card p-6 group cursor-pointer"
              >
                {/* Top accent line */}
                <div className={`h-1 w-full -mx-6 -mt-6 mb-6 rounded-t-xl bg-gradient-to-r ${feat.color}`} style={{ marginTop: '-1.5rem', marginLeft: '-1.5rem', marginRight: '-1.5rem', width: 'calc(100% + 3rem)' }} />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}
                  style={{ background: `hsl(var(--${feat.bg.replace('bg-', '')}))` }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                  {t(`features.${feat.key}.title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`features.${feat.key}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
