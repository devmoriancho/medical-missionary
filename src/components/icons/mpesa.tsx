import React from "react";

export function MpesaIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* The Mobile Connection Frame Representation */}
      <rect width="44" height="20" x="2" y="2" rx="3" />
      {/* The M Letter Identity Block */}
      <path d="M7 16V8l3 4 3-4v8" />
      {/* The Transfer Arrow Indicator */}
      <path d="M18 12h6m-2-3 3 3-3 3" />
    </svg>
  );
}
