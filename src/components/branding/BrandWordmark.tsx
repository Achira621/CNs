import React from 'react';

interface BrandWordmarkProps {
  className?: string;
  lightCanvas?: boolean;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className = '',
  lightCanvas = false,
}) => {
  return (
    <div className={`flex flex-col select-none leading-none tracking-tight ${className}`}>
      <span
        className={`font-mono-code font-extrabold text-[13px] tracking-[0.28em] uppercase ${
          lightCanvas ? 'text-zinc-900' : 'text-zinc-100'
        }`}
      >
        CIPHER
      </span>
      <span
        className="font-mono-code text-[9px] tracking-[0.32em] font-semibold text-[#8855C7] mt-0.5 uppercase"
      >
        MASTERCLASS
      </span>
    </div>
  );
};
