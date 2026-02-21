import { Building2, MapPin, Building, GitBranch, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CountUp from 'react-countup';

interface StatsCardsProps {
  stats: {
    totalBanks?: number;
    totalBranches: number;
    totalStates: number;
    totalCities: number;
  };
  variant?: 'default' | 'gradient';
}

export function StatsCards({ stats, variant = 'default' }: StatsCardsProps) {
  const items = [
    ...(stats.totalBanks !== undefined ? [{
      label: 'Total Banks',
      value: stats.totalBanks,
      icon: Building2,
      gradient: 'from-primary/20 via-primary/10 to-primary/5',
      iconBg: 'from-primary to-primary/80',
      borderColor: 'border-primary/30',
    }] : []),
    {
      label: 'All Branches',
      value: stats.totalBranches,
      icon: GitBranch,
      gradient: 'from-secondary/20 via-secondary/10 to-secondary/5',
      iconBg: 'from-secondary to-secondary/80',
      borderColor: 'border-secondary/30',
    },
    {
      label: 'States Covered',
      value: 36,
      subtext: '28 States & 8 UTs',
      icon: MapPin,
      gradient: 'from-accent/20 via-accent/10 to-accent/5',
      iconBg: 'from-accent to-accent/80',
      borderColor: 'border-accent/30',
    },
    {
      label: 'All Cities',
      value: stats.totalCities,
      icon: Building,
      gradient: 'from-primary/15 via-secondary/10 to-accent/5',
      iconBg: 'from-primary via-secondary to-accent',
      borderColor: 'border-primary/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden border-2 ${item.borderColor} ${variant === 'gradient'
            ? `bg-gradient-to-br ${item.gradient}`
            : 'bg-card'
            } hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${item.iconBg} shadow-lg`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  <CountUp end={item.value} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {item.label}
                </p>
                {/* @ts-ignore */}
                {item.subtext && (
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                    {/* @ts-ignore */}
                    {item.subtext}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
