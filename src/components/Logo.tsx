
const Logo = ({ 
  size = "default", 
  variant = "default" 
}: { 
  size?: "small" | "default" | "large";
  variant?: "default" | "scrolled";
}) => {
  const sizeClasses = {
    small: "h-8",
    default: "h-10",
    large: "h-12"
  };

  // Use the new provided logo for all variants
  const logoSrc = "/lovable-uploads/d2faf42c-cf81-4cad-8e62-f8ec27f99b95.png";

  return (
    <div className="flex items-center">
      <img 
        src={logoSrc}
        alt="Home HNI Logo - Header" 
        className={`${sizeClasses[size]} w-auto transition-opacity duration-300`}
      />
    </div>
  );
};

export default Logo;
