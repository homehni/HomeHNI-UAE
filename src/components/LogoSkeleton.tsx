import { Skeleton } from "@/components/ui/skeleton";

interface LogoSkeletonProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const LogoSkeleton = ({ size = "md", className = "" }: LogoSkeletonProps) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8", 
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Skeleton className={`${sizeClasses[size]} rounded`} />
    </div>
  );
};

export default LogoSkeleton;