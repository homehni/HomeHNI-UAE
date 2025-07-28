
import EnhancedLogo from './EnhancedLogo';

// Legacy wrapper for backward compatibility
const Logo = ({ 
  size = "default", 
  variant = "default" 
}: { 
  size?: "small" | "default" | "large";
  variant?: "default" | "scrolled";
}) => {
  // Map legacy sizes to new size system
  const sizeMap = {
    small: "sm" as const,
    default: "md" as const,
    large: "lg" as const
  };

  return (
    <EnhancedLogo 
      size={sizeMap[size]} 
      variant={variant}
      priority={true} // Header logos are typically critical
      showSkeleton={false} // Keep original behavior
    />
  );
};

export default Logo;
