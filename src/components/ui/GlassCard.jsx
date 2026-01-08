import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hover = true, glow = false }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl shadow-2xl",
        hover && "transition-all duration-500 ease-out hover:border-purple-500/30 hover:shadow-purple-500/10 hover:shadow-2xl hover:scale-[1.01]",
        glow && "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-purple-600/20 before:via-blue-500/20 before:to-purple-600/20 before:blur-xl before:opacity-50",
        className
      )}
    >
      {children}
    </div>
  );
}