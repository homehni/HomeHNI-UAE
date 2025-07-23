
import { Link } from 'react-router-dom';

const Logo = ({ 
  size = "default", 
  variant = "default" 
}: { 
  size?: "small" | "default" | "large";
  variant?: "default" | "scrolled";
}) => {
  const sizeClasses = {
    small: "h-6",
    default: "h-8",
    large: "h-10"
  };

  // Use different logos based on the variant
  const logoSrc = variant === "scrolled" 
    ? "/lovable-uploads/773d41c7-0eec-400e-a369-eaae7c40f9ca.png" // Golden logo for scrolled state with white background
    : "/lovable-uploads/4ae8bc66-e5e0-4c61-88f6-cd00789ebc89.png"; // Main logo for default state

  return (
    <Link to="/" className="flex items-center">
      <img 
        src={logoSrc}
        alt="Home HNI Logo" 
        className={`${sizeClasses[size]} w-auto transition-opacity duration-300 hover:opacity-80`}
      />
    </Link>
  );
};

export default Logo;
