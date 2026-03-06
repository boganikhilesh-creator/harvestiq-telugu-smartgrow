import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroFarm from '@/assets/hero-farm.jpg';

const stats = [
  { key: 'hero.stat1', value: '33', icon: '🗺️' },
  { key: 'hero.stat2', value: '50+', icon: '🌾' },
  { key: 'hero.stat3', value: '10K+', icon: '👨‍🌾' },
];

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroFarm})` }}
      />
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--gradient-hero)' }}
      />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-secondary/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
            style={{
              background: 'hsl(42 95% 55% / 0.2)',
              border: '1px solid hsl(42 95% 55% / 0.4)',
              color: 'hsl(42 95% 85%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Leaf className="w-4 h-4" />
            {t('hero.badge')}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            {t('hero.headline')}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/85 mb-8 max-w-xl leading-relaxed"
          >
            {t('hero.subheading')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Link
              to="/crop-planner"
              className="btn-primary flex items-center justify-center gap-2 text-base"
            >
              {t('hero.cta1')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/plant-health"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300"
              style={{
                background: 'hsl(0 0% 100% / 0.15)',
                border: '2px solid hsl(0 0% 100% / 0.4)',
                color: 'white',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'hsl(0 0% 100% / 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'hsl(0 0% 100% / 0.15)';
              }}
            >
              {t('hero.cta2')}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: 'hsl(0 0% 100% / 0.12)',
                  border: '1px solid hsl(0 0% 100% / 0.2)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-white font-bold text-xl leading-none">{stat.value}</div>
                  <div className="text-white/70 text-xs mt-0.5">{t(stat.key)}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
