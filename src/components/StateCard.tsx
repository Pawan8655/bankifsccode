import { Link } from 'react-router-dom';
import { MapPin, Building, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StateCardProps {
  state: string;
  bankSlug: string;
  branchCount: number;
  cityCount: number;
}

export function StateCard({ state, bankSlug, branchCount, cityCount }: StateCardProps) {
  const stateSlug = encodeURIComponent(state);

  return (
    <Link to={`/bank/${bankSlug}/${stateSlug}`}>
      <Card className="group cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-card hover:bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent/40 to-accent/10 group-hover:from-primary/20 group-hover:to-primary/5 transition-colors">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {state}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {cityCount} cities
                  </span>
                  <span>{branchCount} branches</span>
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
