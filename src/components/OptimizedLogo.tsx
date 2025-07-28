import { memo } from 'react';

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "scrolled";
  className?: string;
  priority?: boolean; // For preloading critical logos
}

const OptimizedLogo = memo(({ 
  size = "md", 
  variant = "default",
  className = "",
  priority = false
}: LogoProps) => {
  // Size configurations with responsive breakpoints
  const sizeConfig = {
    xs: { width: 24, height: 24, class: "w-6 h-6" },
    sm: { width: 32, height: 32, class: "w-8 h-8" },
    md: { width: 40, height: 40, class: "w-10 h-10" },
    lg: { width: 48, height: 48, class: "w-12 h-12" },
    xl: { width: 64, height: 64, class: "w-16 h-16" }
  };

  // Use different logos based on variant
  const logoSrc = variant === "scrolled" 
    ? "/lovable-uploads/773d41c7-0eec-400e-a369-eaae7c40f9ca.png" // Golden logo
    : "/lovable-uploads/4ae8bc66-e5e0-4c61-88f6-cd00789ebc89.png"; // Main logo

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc}
        alt="Home HNI Logo" 
        width={config.width}
        height={config.height}
        className={`${config.class} object-contain transition-opacity duration-300`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: '1/1'
        }}
      />
    </div>
  );
});

OptimizedLogo.displayName = 'OptimizedLogo';

export default OptimizedLogo;