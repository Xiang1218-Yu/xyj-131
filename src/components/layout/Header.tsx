import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coins, Globe, Calendar, DollarSign, Heart, Search, Menu, X, Brain, Clock, Shield, Gift, Palette, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/', label: '首页', icon: Coins },
  { path: '/banknotes', label: '全部纸币', icon: Globe },
  { path: '/countries', label: '按国家', icon: Globe },
  { path: '/years', label: '按年份', icon: Calendar },
  { path: '/denominations', label: '按面值', icon: DollarSign },
  { path: '/design-elements', label: '设计元素', icon: Palette },
  { path: '/timeline', label: '时间轴', icon: Clock },
  { path: '/security-features', label: '防伪百科', icon: Shield },
  { path: '/currency-converter', label: '货币换算', icon: TrendingUp },
  { path: '/lucky-draw', label: '幸运抽卡', icon: Gift },
  { path: '/quiz', label: '知识答题', icon: Brain },
  { path: '/favorites', label: '收藏夹', icon: Heart },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/banknotes?search=${encodeURIComponent(searchValue)}`);
      setSearchValue('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-gold/20 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold-lg group-hover:shadow-gold-xl transition-all duration-300">
              <Coins className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="font-display text-xl text-parchment tracking-wider group-hover:text-gold transition-colors">
                纸币收藏馆
              </h1>
              <p className="text-xs text-gold-muted font-sans tracking-widest">WORLD BANKNOTE</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path === '/quiz' && location.pathname.startsWith('/quiz'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-sm font-display text-sm tracking-wider transition-all duration-300 flex items-center gap-2',
                    isActive
                      ? 'bg-gold/10 text-gold border border-gold/30'
                      : 'text-parchment/70 hover:text-gold hover:bg-gold/5'
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-muted" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索..."
                className="w-48 bg-background-light/50 border border-gold/20 rounded-sm pl-10 pr-4 py-2 text-sm text-parchment placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-all"
              />
            </form>
          </div>

          <button
            className="lg:hidden text-parchment p-2 hover:text-gold transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gold/10 pt-4 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-muted" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索纸币..."
                className="w-full bg-background-light border border-gold/20 rounded-sm pl-10 pr-4 py-3 text-parchment placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path ||
                (item.path === '/quiz' && location.pathname.startsWith('/quiz'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-sm font-display tracking-wider transition-all flex items-center gap-3',
                      isActive
                        ? 'bg-gold/10 text-gold border-l-2 border-gold'
                        : 'text-parchment/70 hover:text-gold hover:bg-gold/5'
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
