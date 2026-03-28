import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Calculator, CreditCard, Search } from 'lucide-react';
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
    { to: '/', label: 'Home', icon: Home },
    { to: '/#ifsc-tools', label: 'IFSC Tools', icon: Calculator },
    { to: '/#financial-products', label: 'Financial Products', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            className="hidden w-72 items-center rounded-lg border bg-background px-3 py-1.5 md:flex"
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

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = link.to === '/' ? location.pathname === '/' : location.hash === link.to.split('#')[1];

              return (
                <a
                  key={link.to}
                  href={link.to}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="animate-fade-in border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
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
