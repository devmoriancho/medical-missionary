interface AppLogoProps {
  size?: number;
  color?: string;
}

export const AppLogo = ({ size = 40, color = "#0F766E" }: AppLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://w3.org"
    >
      <rect x="5" y="5" width="90" height="90" rx="24" fill={color} />

      <path
        d="M42 30 H58 V42 H70 V58 H58 V70 H42 V58 H30 V42 H42 V30 Z"
        fill="#FFFFFF"
      />

      <path
        d="M58 30 C 58 30, 70 30, 70 42 C 70 36, 64 30, 58 30 Z"
        fill="#22C55E"
      />

      <circle cx="65" cy="35" r="4" fill="#38BDF8" />
    </svg>
  );
};
