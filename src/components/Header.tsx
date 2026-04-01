import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.jpeg';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ifscQuery, setIfscQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/tools', label: 'Financial Tools' },
    { to: '/#financial-products', label: 'Financial Products' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-100/60 bg-white/85 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <img
              src={logo}
              alt="Bankifscode.biz"
              className="h-10 w-auto rounded-md transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="hidden bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent sm:inline-block">
              Bankifsccode.biz
            </div>
          </Link>

          <form
            className="hidden w-72 items-center rounded-xl border border-indigo-100 bg-white px-3 py-1.5 shadow-sm md:flex"
            onSubmit={(e) => {
              e.preventDefault();
              if (ifscQuery.trim()) {
                navigate(`/branch/${encodeURIComponent(ifscQuery.trim().toUpperCase())}`);
                setIfscQuery('');
              }
            }}
          >
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              value={ifscQuery}
              onChange={(e) => setIfscQuery(e.target.value)}
              placeholder="Search IFSC (e.g. SBIN0001234)"
              className="w-full bg-transparent text-sm outline-none"
              aria-label="Search IFSC code"
            />
          </form>

          <nav className="hidden items-center gap-2 lg:flex">
            {navLinks.map((link) => {
              const hashTarget = link.to.includes('#') ? `#${link.to.split('#')[1]}` : '';
              const isRoot = link.to === '/';
              const isHashLink = link.to.startsWith('/#');
              const isPathLink = !isRoot && !isHashLink;
              const isActive = isRoot
                ? location.pathname === '/' && !location.hash
                : isHashLink
                  ? location.pathname === '/' && location.hash === hashTarget
                  : isPathLink && location.pathname === link.to;

              return (
                <a
                  key={link.to}
                  href={link.to}
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
                    isActive ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" className="rounded-xl border border-indigo-100 bg-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="animate-fade-in rounded-b-2xl border-t border-indigo-100 bg-white py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
