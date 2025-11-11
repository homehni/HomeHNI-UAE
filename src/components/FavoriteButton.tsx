import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  showTooltip?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  size = 'md',
  variant = 'ghost',
  className,
  showTooltip = true
}) => {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const favorited = isFavorite(propertyId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        sizeClasses[size],
        'rounded-full transition-all duration-200',
        favorited 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500',
        variant === 'ghost' && favorited && 'bg-red-50 hover:bg-red-100',
        variant === 'ghost' && !favorited && 'bg-white/80 hover:bg-white',
        className
      )}
      title={showTooltip ? (favorited ? 'Remove from favorites' : 'Add to favorites') : undefined}
    >
      <Heart 
        className={cn(
          iconSizes[size], 
          'transition-all duration-200',
          favorited && 'fill-current'
        )} 
      />
    </Button>
  );
};
