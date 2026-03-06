import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{ background: 'hsl(var(--foreground))' }} className="text-white/80">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-primary-glow">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">HarvestIQ</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/20"
                  style={{ background: 'hsl(0 0% 100% / 0.1)' }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: t('nav.home'), path: '/' },
                { label: t('nav.cropPlanner'), path: '/crop-planner' },
                { label: t('nav.weather'), path: '/weather' },
                { label: t('nav.plantHealth'), path: '/plant-health' },
                { label: t('nav.cropLibrary'), path: '/crop-library' },
                { label: t('nav.market'), path: '/market' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Districts */}
          <div>
            <h4 className="font-bold text-white mb-4">Telangana Districts</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Adilabad', 'Mahabubnagar', 'Nalgonda'].map((d) => (
                <li key={d}>📍 {d}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                Hyderabad, Telangana, India
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                +91 40 1234 5678
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                info@harvestiq.in
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-lg" style={{ background: 'hsl(0 0% 100% / 0.08)' }}>
              <p className="text-xs text-white/50 font-medium mb-1">🌾 Kisan Helpline</p>
              <p className="text-secondary font-bold text-lg">1800-180-1551</p>
              <p className="text-xs text-white/40">Toll Free • Mon–Sat 6am–10pm</p>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40"
          style={{ borderTop: '1px solid hsl(0 0% 100% / 0.1)' }}
        >
          <span>{t('footer.rights')}</span>
          <span>Made with 💚 for Telangana Farmers</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
