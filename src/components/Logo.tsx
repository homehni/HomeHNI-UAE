
const Logo = ({ 
  size = "default", 
  variant = "default" 
}: { 
  size?: "small" | "default" | "large";
  variant?: "default" | "scrolled";
}) => {
  const sizeClasses = {
    small: "h-6 sm:h-8",
    default: "h-8 sm:h-10",
    large: "h-10 sm:h-12"
  };

  // Use the new provided logo for all variants
  const logoSrc = "/lovable-uploads/main-logo-final.png";

  return (
    <div className="flex items-center">
      <img 
        src={logoSrc}
        alt="Home HNI Logo - Header" 
        className={`${sizeClasses[size]} w-auto max-w-[120px] sm:max-w-none object-contain transition-opacity duration-300`}
      />
    </div>
  );
};

export default Logo;
