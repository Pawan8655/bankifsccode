import { Link } from 'react-router-dom';
import { History, X, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory';
import { formatDistanceToNow } from 'date-fns';

export function SearchHistorySection() {
  const { history, removeFromHistory, clearHistory } = useSearchHistory();

  if (history.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                  <History className="h-5 w-5" />
                </div>
                <span className="gradient-text font-bold">Recent Searches</span>
                <Badge variant="outline" className="ml-2 border-primary/30 text-primary">
                  {history.length}
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear History
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {history.map((item, index) => (
                <HistoryCard
                  key={item.ifsc}
                  item={item}
                  index={index}
                  onRemove={() => removeFromHistory(item.ifsc)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

interface HistoryCardProps {
  item: SearchHistoryItem;
  index: number;
  onRemove: () => void;
}

function HistoryCard({ item, index, onRemove }: HistoryCardProps) {
  const timeAgo = formatDistanceToNow(new Date(item.searchedAt), { addSuffix: true });

  return (
    <Link
      to={`/branch/${item.ifsc}`}
      className="group block animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Card className="h-full border border-border/50 hover:border-primary/50 bg-card hover:bg-primary/5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-3 w-3" />
        </Button>

        <CardContent className="p-4">
          <div className="font-mono font-bold text-primary text-sm mb-1 group-hover:text-primary/80 transition-colors flex items-center gap-1">
            {item.ifsc}
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="font-medium text-foreground text-sm line-clamp-1 mb-1">
            {item.branchName}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {item.bankName}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground/70">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
