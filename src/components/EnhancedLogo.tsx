import { memo, useState } from 'react';
import { useLogo } from '@/hooks/useLogo';
import LogoSkeleton from './LogoSkeleton';

interface EnhancedLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "scrolled";
  className?: string;
  priority?: boolean;
  showSkeleton?: boolean;
  onClick?: () => void;
}

const EnhancedLogo = memo(({ 
  size = "md", 
  variant = "default",
  className = "",
  priority = false,
  showSkeleton = true,
  onClick
}: EnhancedLogoProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { logoSrc, isLoaded } = useLogo({ variant });

  // Size configurations
  const sizeConfig = {
    xs: { width: 24, height: 24, class: "w-6 h-6" },
    sm: { width: 32, height: 32, class: "w-8 h-8" },
    md: { width: 40, height: 40, class: "w-10 h-10" },
    lg: { width: 48, height: 48, class: "w-12 h-12" },
    xl: { width: 64, height: 64, class: "w-16 h-16" }
  };

  const config = sizeConfig[size];
  const isInteractive = !!onClick;

  // Show skeleton while loading if enabled
  if (showSkeleton && (!isLoaded || !imageLoaded) && !imageError) {
    return <LogoSkeleton size={size} className={className} />;
  }

  // Fallback for errors
  if (imageError) {
    return (
      <div 
        className={`${config.class} ${className} bg-muted rounded flex items-center justify-center`}
        onClick={onClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
      >
        <span className="text-xs font-semibold text-muted-foreground">LOGO</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center ${className} ${isInteractive ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <img 
        src={logoSrc}
        alt="Home HNI Logo" 
        width={config.width}
        height={config.height}
        className={`${config.class} object-contain transition-all duration-300 ${isInteractive ? 'hover:scale-105' : ''}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: '1/1'
        }}
      />
    </div>
  );
});

EnhancedLogo.displayName = 'EnhancedLogo';

export default EnhancedLogo;