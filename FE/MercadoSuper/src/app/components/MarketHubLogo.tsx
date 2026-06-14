type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
};

export default function MarketHubLogo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-6 h-6', text: 'text-base', icon: 'text-xs' },
    md: { container: 'w-8 h-8', text: 'text-2xl', icon: 'text-sm' },
    lg: { container: 'w-12 h-12', text: 'text-3xl', icon: 'text-xl' },
  };

  const config = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${config.container} bg-gradient-to-br from-[#2563EB] to-[#22C55E] rounded-xl flex items-center justify-center shadow-lg`}
      >
        <span className={`text-white font-bold ${config.icon}`}>M</span>
      </div>
      {showText && (
        <span className={`font-bold text-[#1E293B] ${config.text}`}>MarketHub</span>
      )}
    </div>
  );
}
