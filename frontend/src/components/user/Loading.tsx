import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <div className="relative">
        {/* Spinning ring */}
        <div
          className={cn(
            "border-4 border-gray-200 border-t-primary rounded-full animate-spin",
            sizeClasses[size]
          )}
        />

        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>

      {/* Brand text with animated dots */}
      <div
        className={cn(
          "flex items-center gap-1 font-semibold text-gray-700",
          textSizeClasses[size]
        )}
      >
        <span>TradeNest</span>
        <div className="flex gap-1">
          <div
            className="w-1 h-1 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-1 h-1 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-1 h-1 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
