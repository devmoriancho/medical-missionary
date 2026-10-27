import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function MissionLogo({ size = 32, className, ...props }: IconProps) {
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
      <path d="M3 12c3-4 6-4 9-1m-9 1c2 2 4 4 7 4" />

      <path d="M6 9c3-4 5-4 9-2m-9 2c2 1 3 3 6 3" />

      <path d="M9 6c3-3 5-3 9-2m-9 2c1 1 2 2 5 2" />

      <path d="M12 7h6l3-2v4l-3-2" />
      <path d="M15 10h5l2-2v4l-2-2" />
    </svg>
  );
}
