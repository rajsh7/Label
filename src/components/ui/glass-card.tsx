import { cn } from "@/lib/utils/cn"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "panel" | "sidebar"
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  const variants = {
    default: "bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-2xl",
    panel: "bg-[#18181b]/50 backdrop-blur-[40px] border border-white/[0.08] shadow-2xl ring-1 ring-white/5",
    sidebar: "bg-[#18181b]/40 backdrop-blur-[40px] border-r border-white/[0.05]",
  }

  return (
    <div 
      className={cn(
        "rounded-3xl",
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}
