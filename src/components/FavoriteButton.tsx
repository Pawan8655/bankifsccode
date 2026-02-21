import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { IFSCData } from '@/lib/csvParser';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  branch: IFSCData;
  variant?: 'default' | 'icon';
  className?: string;
}

export function FavoriteButton({ branch, variant = 'default', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isBookmarked = isFavorite(branch.IFSC);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(branch);
    toast({
      title: isBookmarked ? 'Removed from favorites' : 'Added to favorites',
      description: isBookmarked 
        ? `${branch.Branch} has been removed` 
        : `${branch.Branch} has been saved`,
    });
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className={cn(
          'h-9 w-9 rounded-full transition-all duration-300',
          isBookmarked 
            ? 'bg-secondary/20 text-secondary hover:bg-secondary/30' 
            : 'hover:bg-secondary/10 hover:text-secondary',
          className
        )}
      >
        <Heart 
          className={cn(
            'h-5 w-5 transition-all duration-300',
            isBookmarked && 'fill-current scale-110'
          )} 
        />
      </Button>
    );
  }

  return (
    <Button
      variant={isBookmarked ? 'secondary' : 'outline'}
      size="sm"
      onClick={handleClick}
      className={cn(
        'gap-2 transition-all duration-300',
        isBookmarked && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        className
      )}
    >
      <Heart 
        className={cn(
          'h-4 w-4 transition-all duration-300',
          isBookmarked && 'fill-current'
        )} 
      />
      {isBookmarked ? 'Saved' : 'Save'}
    </Button>
  );
}
