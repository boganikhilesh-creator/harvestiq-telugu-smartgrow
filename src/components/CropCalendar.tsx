import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cropCalendar } from '@/data/farmData';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthNamesTe = ['జన', 'ఫిబ్ర', 'మార్చి', 'ఏప్రి', 'మే', 'జూన్', 'జూలై', 'ఆగ', 'సెప్ట', 'అక్టో', 'నవం', 'డిసె'];

const CropCalendar = () => {
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
          <span className="badge-green mb-4 inline-block">Planting Guide</span>
          <h2 className="section-title mt-2">{t('cal.title')}</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t('cal.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[700px]">
            {/* Month header */}
            <div className="grid grid-cols-[140px_repeat(12,1fr)] gap-1 mb-2">
              <div className="text-xs text-muted-foreground font-medium">Crop</div>
              {(language === 'te' ? monthNamesTe : monthNames).map((m) => (
                <div key={m} className="text-center text-xs text-muted-foreground font-medium">{m}</div>
              ))}
            </div>

            {/* Crop rows */}
            {Object.entries(cropCalendar).map(([crop, data], i) => (
              <motion.div
                key={crop}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="grid grid-cols-[140px_repeat(12,1fr)] gap-1 mb-1.5"
              >
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <span>{data.emoji}</span>
                  <span className="truncate">{crop}</span>
                </div>
                {Array.from({ length: 12 }, (_, monthIdx) => {
                  const monthNum = monthIdx + 1;
                  const isActive = data.months.includes(monthNum);
                  return (
                    <div
                      key={monthIdx}
                      className={`h-7 rounded transition-all duration-300 ${
                        isActive
                          ? `${data.color} opacity-90 shadow-sm`
                          : 'bg-muted'
                      }`}
                      title={isActive ? `${crop} - ${monthNames[monthIdx]}` : ''}
                    />
                  );
                })}
              </motion.div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-5 h-3 rounded bg-green-500" />
                <span className="text-xs text-muted-foreground">Planting Season</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-3 rounded bg-muted" />
                <span className="text-xs text-muted-foreground">Off Season</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CropCalendar;
