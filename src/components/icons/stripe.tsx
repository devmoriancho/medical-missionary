import React from "react";

export function StripeIcon({
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
      <rect width="44" height="20" x="2" y="2" rx="3" />

      <path d="M2 7h44" />
      <rect width="6" height="4" x="6" y="12" rx="1" />
    </svg>
  );
}
