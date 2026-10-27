import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function ScaleIcon({ size = 24, className, ...props }: IconProps) {
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
      <path d="M16 16c0-3.5 2-6 4-10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
      <path d="M6 12H2l2-5h2Z" />
      <path d="M22 12h-4l2-5h2Z" />
      <path d="M2 21h20" />
    </svg>
  );
}
