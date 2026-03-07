import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.cropPlanner', path: '/crop-planner' },
    { key: 'nav.weather', path: '/weather' },
    { key: 'nav.plantHealth', path: '/plant-health' },
    { key: 'nav.cropLibrary', path: '/crop-library' },
    { key: 'nav.market', path: '/market' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-lg gradient-text">HarvestIQ</span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">Smart Farming</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-link px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-primary font-semibold bg-primary/10'
                  : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              borderColor: 'hsl(var(--primary) / 0.3)',
              background: 'hsl(var(--primary-light))',
              color: 'hsl(var(--primary))',
            }}
          >
            {t('nav.langToggle')}
          </button>

          {/* Auth buttons */}
          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                <UserCircle className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                <span className="max-w-[120px] truncate">{profile?.full_name || user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:bg-destructive/10"
                style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:bg-primary/5"
                style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
              >
                Get Started
              </Link>
            </div>
          )}

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-card/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}

              {/* Mobile auth */}
              <div className="border-t border-border/50 pt-2 mt-1 flex flex-col gap-1">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                      <UserCircle className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                      {profile?.full_name || user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-left flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all" style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}>
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

