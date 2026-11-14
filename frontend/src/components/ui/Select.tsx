import React from "react";
import { ChevronDown } from "lucide-react";
import { FIELD } from "./fieldStyles";

// A native <select> without the browser's arrow (which sits flush against the border and adds its own
// inner padding), plus the same inset chevron the custom dropdowns use, so every field lines up.
export default function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={`${FIELD} appearance-none pr-10 ${className}`} {...props}>
        {children}
      </select>
      <ChevronDown
        size={16}
        aria-hidden
        className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 ${
          props.disabled ? "text-slate-600" : "text-slate-400"
        }`}
      />
    </div>
  );
}
