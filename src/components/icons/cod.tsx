import React from "react";

export function CodIcon({
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
      <path d="M2 17h18v-6H8V6H2v11z" />
      <path d="M20 11h6l4 3v3h-10v-6z" />

      <circle cx="6" cy="18" r="2" />
      <circle cx="24" cy="18" r="2" />
      <path d="M11 9h4v3h-4z" />
    </svg>
  );
}
