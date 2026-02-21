import { Link } from 'react-router-dom';
import { Heart, Trash2, Star, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites, FavoriteBranch } from '@/hooks/useFavorites';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function FavoritesSection() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  if (favorites.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 via-card to-primary/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </div>
                <span className="gradient-text font-bold">Favorite Branches</span>
                <Badge variant="secondary" className="ml-2 bg-secondary/20 text-secondary-foreground">
                  {favorites.length}
                </Badge>
              </CardTitle>
              {favorites.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFavorites}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {favorites.map((fav, index) => (
                  <FavoriteCard
                    key={fav.ifsc}
                    favorite={fav}
                    index={index}
                    onRemove={() => removeFavorite(fav.ifsc)}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

interface FavoriteCardProps {
  favorite: FavoriteBranch;
  index: number;
  onRemove: () => void;
}

function FavoriteCard({ favorite, index, onRemove }: FavoriteCardProps) {
  return (
    <Link
      to={`/branch/${favorite.ifsc}`}
      className="group block min-w-[280px] animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card className="h-full border-2 border-transparent hover:border-secondary/50 bg-gradient-to-br from-card via-card to-secondary/5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute top-2 left-2">
          <Star className="h-4 w-4 text-secondary fill-secondary" />
        </div>

        <CardContent className="p-5 pt-8">
          <div className="font-mono font-bold text-primary text-lg mb-2">
            {favorite.ifsc}
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-secondary transition-colors line-clamp-1 mb-1">
            {favorite.branchName}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {favorite.bankName}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {favorite.city}, {favorite.state}
          </p>
        </CardContent>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </Link>
  );
}
