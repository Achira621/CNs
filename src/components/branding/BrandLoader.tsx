import React from 'react';
import { BrandIcon } from './BrandIcon';

interface BrandLoaderProps {
  label?: string;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({
  label = 'Initialising Cryptographic Kernel...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative">
        <BrandIcon size={52} glow={true} className="animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-[#8855C7]/30 border-t-[#8855C7] animate-spin" />
      </div>
      <p className="font-mono-code text-xs text-zinc-400 tracking-wide animate-pulse">
        {label}
      </p>
    </div>
  );
};
