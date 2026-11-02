import React from 'react';
import { BrandIcon } from './BrandIcon';
import { BrandWordmark } from './BrandWordmark';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'stacked';
  lightCanvas?: boolean;
  size?: number;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  lightCanvas = false,
  size = 38,
  onClick,
}) => {
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      >
        <BrandIcon size={size} glow={true} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center gap-2 cursor-pointer text-center group ${className}`}
      >
        <BrandIcon size={size * 1.3} glow={true} className="group-hover:scale-105 transition-transform" />
        <BrandWordmark lightCanvas={lightCanvas} />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      <BrandIcon size={size} glow={true} className="group-hover:scale-105 transition-transform" />
      <BrandWordmark lightCanvas={lightCanvas} />
    </div>
  );
};
