import { Link } from 'react-router-dom';
import { Building2, ChevronRight, GitBranch, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BankCardProps {
  bank: string;
  branchCount: number;
  stateCount: number;
}

export function BankCard({ bank, branchCount, stateCount }: BankCardProps) {
  const bankSlug = encodeURIComponent(bank);

  return (
    <Link to={`/bank/${bankSlug}`}>
      <Card className="group cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card hover:bg-accent/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {bank}
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3 w-3 sm:h-4 sm:w-4" />
                    {branchCount} branches
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    {stateCount} states
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
