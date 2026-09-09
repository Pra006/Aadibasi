import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-forest-base text-ivory-canvas border border-antique-gold/40 hover:bg-forest-deep shadow-md",
  secondary:
    "bg-transparent text-forest-deep border border-forest-base/30 hover:bg-forest-base/5",
  gold:
    "bg-antique-gold text-forest-deep border border-antique-gold hover:brightness-95 shadow-md",
  ghost: "bg-transparent text-forest-deep hover:bg-forest-base/5",
  danger: "bg-error text-white hover:brightness-95",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-sm sm:text-base",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) {
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded font-semibold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-antique-gold/50 disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
