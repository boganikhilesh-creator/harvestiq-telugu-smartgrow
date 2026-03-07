import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sprout, LogIn, LogOut, UserCircle, Settings, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Farmer';
  const initials = displayName.slice(0, 2).toUpperCase();

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

          {/* Auth area — desktop */}
          {user ? (
            /* User avatar dropdown */
            <div className="hidden lg:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border transition-all hover:bg-primary/5"
                style={{ borderColor: 'hsl(var(--border))' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
                >
                  {initials}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{displayName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border shadow-xl overflow-hidden"
                    style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {/* Profile Settings */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-primary/5"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      <Settings className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                      Profile Settings
                    </Link>
                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-destructive/10 text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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

              {/* Mobile auth section */}
              <div className="border-t border-border/50 pt-2 mt-1 flex flex-col gap-1">
                {user ? (
                  <>
                    {/* User info */}
                    <div className="px-4 py-2 flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {/* Profile Settings */}
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    {/* Sign Out */}
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


