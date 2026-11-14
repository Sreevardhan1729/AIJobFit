import React from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "ghost";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700",
  secondary: "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800",
  ghost: "text-indigo-300 hover:text-indigo-200",
};

type ButtonProps = {
  variant?: Variant;
  href?: string;
  to?: string;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export default function Button({
  variant = "primary",
  href,
  to,
  loading = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  if (href) {
    const external = href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={href} className={classes} {...external}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
