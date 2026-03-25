import { Home, Wrench, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/blogs', label: 'Blog', icon: BookOpen },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link key={tab.to} to={tab.to} className={cn('flex flex-col items-center py-2.5 text-xs', active ? 'text-primary font-semibold' : 'text-muted-foreground')}>
              <tab.icon className="h-4 w-4 mb-1" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
