import { cn } from "@/lib/utils";

export default function NeonButton({ 
  children, 
  variant = "primary", 
  size = "default",
  className, 
  ...props 
}) {
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
    secondary: "bg-white/5 border border-white/20 hover:bg-white/10 hover:border-purple-500/50 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button
      className={cn(
        "relative font-semibold rounded-xl transition-all duration-300 ease-out",
        "transform active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}