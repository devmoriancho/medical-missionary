import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function WindIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12.8 18a2.2 2.2 0 1 1-2.2 2.2" />
      <path d="M2 12h14a2.5 2.2 0 1 1-1.5 4" />
      <path d="M20 8H2a2.5 2.2 0 1 0 2.5 4" />
    </svg>
  );
}
